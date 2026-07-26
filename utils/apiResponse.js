class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    const response = {
      success: true,
      message,
    };
    if (data !== null) {
      if (data.meta) {
        response.meta = data.meta;
        response.data = data.data;
      } else {
        response.data = data;
      }
    }
    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = "Created Successfully") {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static paginated(res, data, meta) {
    return ApiResponse.success(res, { data, meta }, "Success");
  }
}

module.exports = ApiResponse;
