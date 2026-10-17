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
    } else if (value instanceof RegExp) {
      where[key] = { [Op.regexp]: value.source };
    } else if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof RegExp)) {
      // Handle operators inside value: { $regex, $options, $in, $gte, etc. }
      const fieldOps = {};
      for (const [opKey, opVal] of Object.entries(value)) {
        if (opKey === "$regex") {
          const pattern = opVal instanceof RegExp ? opVal.source : String(opVal).replace(/^\^|\$$/g, "");
          if (pattern.includes("|") || pattern.includes("(") || pattern.includes("[")) {
            fieldOps[Op.regexp] = pattern;
          } else {
            fieldOps[Op.like] = `%${pattern}%`;
          }
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

  const origAggregate = Model.aggregate ? Model.aggregate.bind(Model) : null;
  Model.aggregate = async function (pipeline) {
    if (!Array.isArray(pipeline)) {
      if (origAggregate) return origAggregate.apply(this, arguments);
      return [];
    }

    try {
      const sequelize = this.sequelize;
      let where = {};
      let groupStage = null;
      let sortStage = null;
      let limitNum = null;

      for (const stage of pipeline) {
        if (!stage || typeof stage !== "object") continue;
        if (stage.$match) {
          const matchWhere = translateMongoQuery(stage.$match);
          where = { ...where, ...matchWhere };
        } else if (stage.$group) {
          groupStage = stage.$group;
        } else if (stage.$sort) {
          sortStage = stage.$sort;
        } else if (stage.$limit) {
          limitNum = Number(stage.$limit);
        }
      }

      if (!groupStage) {
        const findOptions = { where, raw: true };
        if (sortStage) findOptions.order = parseSortOrder(sortStage);
        if (limitNum) findOptions.limit = limitNum;
        const rows = await this.findAll(findOptions);
        return rows.map((r) => {
          if (r && !r._id && r.id) r._id = r.id;
          return r;
        });
      }

      const attributes = [];
      const groupCols = [];
      const idExpr = groupStage._id;
      const isGroupIdNull = idExpr === null || idExpr === undefined;

      if (!isGroupIdNull) {
        if (typeof idExpr === "string" && idExpr.startsWith("$")) {
          const field = idExpr.substring(1);
          attributes.push([sequelize.col(field), "_id"]);
          groupCols.push(sequelize.col(field));
        } else if (typeof idExpr === "object") {
          if (idExpr.$dateToString) {
            const dateField = (idExpr.$dateToString.date || "$createdAt").replace(/^\$/, "");
            const fmt = idExpr.$dateToString.format === "%Y-%m" ? "%Y-%m" : idExpr.$dateToString.format || "%Y-%m-%d";
            const fnExpr = sequelize.fn("DATE_FORMAT", sequelize.col(dateField), fmt);
            attributes.push([fnExpr, "_id"]);
            groupCols.push(fnExpr);
          } else if (idExpr.$hour) {
            const dateField = (typeof idExpr.$hour === "string" ? idExpr.$hour : "$timestamp").replace(/^\$/, "");
            const fnExpr = sequelize.fn("HOUR", sequelize.col(dateField));
            attributes.push([fnExpr, "_id"]);
            groupCols.push(fnExpr);
          } else if (idExpr.$month) {
            const dateField = (typeof idExpr.$month === "string" ? idExpr.$month : "$timestamp").replace(/^\$/, "");
            const fnExpr = sequelize.fn("MONTH", sequelize.col(dateField));
            attributes.push([fnExpr, "_id"]);
            groupCols.push(fnExpr);
          } else if (idExpr.$year) {
            const dateField = (typeof idExpr.$year === "string" ? idExpr.$year : "$timestamp").replace(/^\$/, "");
            const fnExpr = sequelize.fn("YEAR", sequelize.col(dateField));
            attributes.push([fnExpr, "_id"]);
            groupCols.push(fnExpr);
          } else {
            for (const [k, v] of Object.entries(idExpr)) {
              if (typeof v === "string" && v.startsWith("$")) {
                const f = v.substring(1);
                attributes.push([sequelize.col(f), k]);
                groupCols.push(sequelize.col(f));
              }
            }
          }
        }
      }

      for (const [key, expr] of Object.entries(groupStage)) {
        if (key === "_id") continue;
        if (typeof expr === "object" && expr !== null) {
          if (expr.$sum !== undefined) {
            if (expr.$sum === 1) {
              attributes.push([sequelize.fn("COUNT", sequelize.col(this.primaryKeyAttribute || "id")), key]);
            } else if (typeof expr.$sum === "string" && expr.$sum.startsWith("$")) {
              const f = expr.$sum.substring(1);
              attributes.push([sequelize.fn("COALESCE", sequelize.fn("SUM", sequelize.col(f)), 0), key]);
            } else if (typeof expr.$sum === "number") {
              attributes.push([sequelize.literal(`${expr.$sum} * COUNT(*)`), key]);
            }
          } else if (expr.$avg !== undefined) {
            const f = typeof expr.$avg === "string" ? expr.$avg.replace(/^\$/, "") : "rating";
            attributes.push([sequelize.fn("COALESCE", sequelize.fn("AVG", sequelize.col(f)), 0), key]);
          } else if (expr.$min !== undefined) {
            const f = typeof expr.$min === "string" ? expr.$min.replace(/^\$/, "") : "id";
            attributes.push([sequelize.fn("MIN", sequelize.col(f)), key]);
          } else if (expr.$max !== undefined) {
            const f = typeof expr.$max === "string" ? expr.$max.replace(/^\$/, "") : "id";
            attributes.push([sequelize.fn("MAX", sequelize.col(f)), key]);
          } else if (expr.$first !== undefined) {
            const f = typeof expr.$first === "string" ? expr.$first.replace(/^\$/, "") : "id";
            attributes.push([sequelize.fn("MIN", sequelize.col(f)), key]);
          }
        }
      }

      const queryOptions = {
        where,
        attributes: attributes.length > 0 ? attributes : undefined,
        raw: true,
      };

      if (groupCols.length > 0) {
        queryOptions.group = groupCols;
      }

      if (sortStage) {
        if (typeof sortStage === "object") {
          queryOptions.order = Object.entries(sortStage).map(([k, v]) => {
            const dir = v === -1 || v === "desc" ? "DESC" : "ASC";
            if (k === "_id" && groupCols.length > 0) {
              return [groupCols[0], dir];
            }
            return [sequelize.literal(`\`${k}\``), dir];
          });
        }
      }

      if (limitNum) {
        queryOptions.limit = limitNum;
      }

      const results = await this.findAll(queryOptions);

      return results.map((row) => {
        const item = { ...row };
        if (isGroupIdNull) {
          item._id = null;
        }
        for (const [k, v] of Object.entries(item)) {
          if (k !== "_id" && typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v)) {
            item[k] = Number(v);
          }
        }
        return item;
      });
    } catch (err) {
      console.error(`Aggregate emulation error on ${this.name}:`, err);
      return [];
    }
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
