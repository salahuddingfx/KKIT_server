const { Op, Model: SequelizeModel } = require("sequelize");

if (SequelizeModel && SequelizeModel.prototype) {
  SequelizeModel.prototype.toObject = function () {
    const obj = this.toJSON ? this.toJSON() : { ...this.get() };
    if (!obj._id && obj.id) obj._id = obj.id;
    return obj;
  };
}

function translateMongoQuery(query = {}) {
  if (!query || typeof query !== "object") return {};
  const where = {};

  for (const [key, value] of Object.entries(query)) {
    if (key === "$or" && Array.isArray(value)) {
      where[Op.or] = value.map(translateMongoQuery);
    } else if (key === "$and" && Array.isArray(value)) {
      where[Op.and] = value.map(translateMongoQuery);
    } else if (key === "_id") {
      where.id = value;
    } else if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      // Handle operators inside value: { $regex, $options, $in, $gte, etc. }
      const fieldOps = {};
      for (const [opKey, opVal] of Object.entries(value)) {
        if (opKey === "$regex") {
          const cleanPattern = String(opVal).replace(/^\^|\$$/g, "");
          fieldOps[Op.like] = `%${cleanPattern}%`;
        } else if (opKey === "$in" && Array.isArray(opVal)) {
          fieldOps[Op.in] = opVal;
        } else if (opKey === "$nin" && Array.isArray(opVal)) {
          fieldOps[Op.notIn] = opVal;
        } else if (opKey === "$gte") {
          fieldOps[Op.gte] = opVal;
        } else if (opKey === "$lte") {
          fieldOps[Op.lte] = opVal;
        } else if (opKey === "$gt") {
          fieldOps[Op.gt] = opVal;
        } else if (opKey === "$lt") {
          fieldOps[Op.lt] = opVal;
        } else if (opKey === "$ne") {
          fieldOps[Op.ne] = opVal;
        }
      }
      if (Object.getOwnPropertySymbols(fieldOps).length > 0 || Object.keys(fieldOps).length > 0) {
        where[key] = fieldOps;
      } else {
        where[key] = value;
      }
    } else if (value instanceof RegExp) {
      const cleanPattern = value.source.replace(/^\^|\$$/g, "");
      where[key] = { [Op.like]: `%${cleanPattern}%` };
    } else {
      where[key] = value;
    }
  }

  return where;
}

function parseSortOrder(sortStr) {
  if (!sortStr) return [["createdAt", "DESC"]];
  if (Array.isArray(sortStr)) return sortStr;
  if (typeof sortStr === "object") {
    return Object.entries(sortStr).map(([k, v]) => [k, v === -1 || v === "desc" ? "DESC" : "ASC"]);
  }

  const parts = String(sortStr).trim().split(/\s+/);
  return parts.map((part) => {
    if (part.startsWith("-")) {
      return [part.substring(1), "DESC"];
    }
    return [part, "ASC"];
  });
}

function enhanceModel(Model) {
  if (Model && Model.prototype && !Model.prototype.toObject) {
    Model.prototype.toObject = function () {
      const obj = this.toJSON ? this.toJSON() : { ...this.get() };
      if (!obj._id && obj.id) obj._id = obj.id;
      return obj;
    };
  }

  const origCreate = Model.create.bind(Model);
  Model.create = function (values, options = {}) {
    if (Array.isArray(values)) {
      return this.bulkCreate(values, { individualHooks: true, returning: true, ...options });
    }
    return origCreate(values, options);
  };

  Model.findById = function (id, options = {}) {
    if (!id) {
      const emptyChain = {
        select() { return this; },
        populate() { return this; },
        lean() { return this; },
        then(resolve) { return Promise.resolve(null).then(resolve); },
        catch(reject) { return Promise.resolve(null).catch(reject); },
      };
      return emptyChain;
    }

    const findOptions = { ...options };

    const queryChain = {
      select(fields) {
        if (typeof fields === "string") {
          const parts = fields.split(/\s+/).filter(Boolean);
          const excludes = parts.filter((p) => p.startsWith("-")).map((p) => p.substring(1));
          const includes = parts.filter((p) => !p.startsWith("-") && !p.startsWith("+"));
          if (excludes.length > 0) {
            findOptions.attributes = { exclude: excludes };
          } else if (includes.length > 0) {
            findOptions.attributes = includes;
          }
        }
        return this;
      },
      populate() {
        return this;
      },
      lean() {
        findOptions.raw = true;
        return this;
      },
      then(resolve, reject) {
        return Model.findByPk(id, findOptions).then((res) => {
          if (!res) return resolve(null);
          let result = res;
          if (findOptions.raw) {
            result = res.toJSON ? res.toJSON() : (res.dataValues ? { ...res.dataValues } : res);
          }
          if (result && !result._id && result.id) {
            result._id = result.id;
          }
          return resolve(result);
        }, reject);
      },
      catch(reject) {
        return Model.findByPk(id, findOptions).catch(reject);
      },
    };

    return queryChain;
  };

  const origFindOne = Model.findOne.bind(Model);
  Model.findOne = function (options = {}) {
    const where = (options && !options.where && !options.attributes && !options.include)
      ? translateMongoQuery(options)
      : (options.where ? options.where : translateMongoQuery(options));
    const findOptions = { where };

    const queryChain = {
      select(fields) {
        if (typeof fields === "string") {
          const parts = fields.split(/\s+/).filter(Boolean);
          const excludes = parts.filter((p) => p.startsWith("-")).map((p) => p.substring(1));
          const includes = parts.filter((p) => !p.startsWith("-") && !p.startsWith("+"));
          if (excludes.length > 0) {
            findOptions.attributes = { exclude: excludes };
          } else if (includes.length > 0) {
            findOptions.attributes = includes;
          }
        }
        return this;
      },
      populate() {
        return this;
      },
      lean() {
        findOptions.raw = true;
        return this;
      },
      then(resolve, reject) {
        return origFindOne(findOptions).then((res) => {
          if (!res) return resolve(null);
          let result = res;
          if (findOptions.raw) {
            result = res.toJSON ? res.toJSON() : (res.dataValues ? { ...res.dataValues } : res);
          }
          if (result && !result._id && result.id) {
            result._id = result.id;
          }
          return resolve(result);
        }, reject);
      },
      catch(reject) {
        return origFindOne(findOptions).catch(reject);
      },
    };

    return queryChain;
  };

  Model.findByIdAndUpdate = async function (id, updateData = {}, options = {}) {
    if (!id) return null;
    const instance = await this.findByPk(id);
    if (!instance) return null;
    const data = updateData.$set ? { ...updateData, ...updateData.$set } : { ...updateData };
    delete data.$set;
    await instance.update(data);
    return instance;
  };

  Model.findByIdAndDelete = async function (id) {
    if (!id) return null;
    const instance = await this.findByPk(id);
    if (!instance) return null;
    await instance.destroy();
    return instance;
  };

  Model.deleteMany = function (query = {}) {
    const where = translateMongoQuery(query);
    return this.destroy({ where });
  };

  Model.insertMany = function (docs = [], options = {}) {
    return this.bulkCreate(docs, { individualHooks: true, ...options });
  };

  Model.countDocuments = function (query = {}) {
    const where = translateMongoQuery(query);
    return this.count({ where });
  };

  Model.distinct = async function (field, query = {}) {
    const where = translateMongoQuery(query);
    const rows = await this.findAll({
      where,
      attributes: [field],
      group: [field],
      raw: true,
    });
    return rows.map((r) => r[field]).filter(Boolean);
  };

  // Mongoose chainable find
  const origFindAll = Model.findAll.bind(Model);
  Model.find = function (query = {}) {
    const where = translateMongoQuery(query);
    const findOptions = { where };

    const queryChain = {
      sort(orderStr) {
        if (orderStr) {
          findOptions.order = parseSortOrder(orderStr);
        }
        return this;
      },
      skip(offsetNum) {
        findOptions.offset = Number(offsetNum) || 0;
        return this;
      },
      limit(limitNum) {
        findOptions.limit = Number(limitNum) || undefined;
        return this;
      },
      populate() {
        return this;
      },
      select(fields) {
        if (typeof fields === "string") {
          findOptions.attributes = fields.split(/\s+/).filter(Boolean);
        }
        return this;
      },
      lean() {
        findOptions.raw = true;
        return this;
      },
      then(resolve, reject) {
        return origFindAll(findOptions).then((results) => {
          if (findOptions.raw) {
            results = results.map((r) => {
              if (r && !r._id && r.id) {
                r._id = r.id;
              }
              return r;
            });
          }
          return resolve(results);
        }, reject);
      },
      catch(reject) {
        return origFindAll(findOptions).catch(reject);
      },
    };

    return queryChain;
  };

  return Model;
}

module.exports = {
  translateMongoQuery,
  parseSortOrder,
  enhanceModel,
};
