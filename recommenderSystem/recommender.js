const Normalized_Utility_Matrix = (Utility_Matrix) => {
  const matrix = JSON.parse(JSON.stringify(Utility_Matrix));
  const avg_rating_arr = [];
  for (let i = 0; i < matrix[0].length; i++) {
    let avg_rating = 0;
    let n = 0;
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[j][i] !== "?") {
        avg_rating += matrix[j][i];
        n++;
      }
    }
    avg_rating_arr.push(avg_rating / n);
  }

  for (let i = 0; i < matrix[0].length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[j][i] !== "?") {
        matrix[j][i] -= avg_rating_arr[i];
      } else {
        matrix[j][i] = 0;
      }
    }
  }
  return matrix;
};

const initialMatrix = (n) => {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    matrix.push([]);
    for (let j = 0; j < n; j++) {
      matrix[i].push(0);
    }
  }
  return matrix;
};

const Similarity_Matrix = (Normalized_Utility_Matrix) => {
  const matrix = initialMatrix(Normalized_Utility_Matrix[0].length);

  for (let i = 0; i < Normalized_Utility_Matrix[0].length; i++) {
    for (let j = 0; j < Normalized_Utility_Matrix[0].length; j++) {
      let result = 0;

      if (i === j) {
        matrix[i][j] = 1;
        continue;
      }

      let multiplication_total = 0;
      let user1 = 0;
      let user2 = 0;

      for (let z = 0; z < Normalized_Utility_Matrix.length; z++) {
        multiplication_total +=
          Normalized_Utility_Matrix[z][i] * Normalized_Utility_Matrix[z][j];
        user1 += Math.pow(Normalized_Utility_Matrix[z][i], 2);
        user2 += Math.pow(Normalized_Utility_Matrix[z][j], 2);
      }
      result = multiplication_total / Math.sqrt(user1 * user2);
      matrix[i][j] = result;
    }
  }
  return matrix;
};

exports.result = (data, customerId, k = 2) => {
  const list_customerId = [];
  const list_productId = [];

  for (const rate of data) {
    if (!list_customerId.includes(rate.userId.toString())) {
      list_customerId.push(rate.userId.toString());
    }
    if (!list_productId.includes(rate.productId.toString())) {
      list_productId.push(rate.productId.toString());
    }
  }
  const display_customerId = list_customerId.map((cus, index) => index + 1);
  const display_productId = list_productId.map((pro, index) => index + 1);

  const Utility_Matrix = (data, display_customerId, display_productId) => {
    const matrix = [];
    for (let i = 0; i < display_productId.length; i++) {
      let row = [];
      for (let j = 0; j < display_customerId.length; j++) {
        let isValid = data.find(
          (dt) =>
            dt.userId == list_customerId[j] && dt.productId == list_productId[i]
        );
        row.push(isValid ? isValid.vote : "?");
      }
      matrix.push(row);
    }
    return matrix;
  };

  const Matrix_Y = (
    Similarity_Matrix,
    Utility_Matrix,
    Normalized_Utility_Matrix,
    customerId,
    k = 2
  ) => {
    const quantity_product = Normalized_Utility_Matrix.length;
    const quantity_customer = Normalized_Utility_Matrix[0].length;
    const result = [];
    let itemIsZero = [];
    let customerIndex = -1;
    for (let i = 0; i < display_customerId.length; i++) {
      if (customerId == list_customerId[i]) {
        customerIndex = i;
        break;
      }
    }
    if (customerIndex === -1) {
      return [];
    }
    // Lap qua so luong san pham, tim san pham chua dc rating
    for (let i = 0; i < quantity_product; i++) {
      if (Utility_Matrix[i][customerIndex] === "?") {
        const userSimilarity = [];
        const productIndex = i;

        for (let j = 0; j < quantity_customer; j++) {
          if (Normalized_Utility_Matrix[productIndex][j] !== 0) {
            userSimilarity.push({
              index: j,
              similarity: Similarity_Matrix[customerIndex][j],
              rated: Normalized_Utility_Matrix[productIndex][j],
            });
          }
        }

        // Neu ko goi y san pham nay, thi duyet cac san pham khac
        if (userSimilarity.length < k) {
          continue;
        }
        console.log("userSimilarity after: ", userSimilarity);

        //sap xep giam dan
        userSimilarity.sort((a, b) => {
          return a.similarity === b.similarity
            ? 0
            : a.similarity > b.similarity
            ? -1
            : 1;
        });
        console.log("userSimilarity before: ", userSimilarity);
        //lay k gia tri similarity lon nhat
        const indexToCalculator = userSimilarity.splice(k).map((x) => x.index);
        // console.log("indexToCalculator: ", indexToCalculator);
        console.log("userSimilarity: ", userSimilarity);

        // Tinh toan
        let tu = 0;
        let mau = 0;

        for (let j = 0; j < k; j++) {
          tu += userSimilarity[j].similarity * userSimilarity[j].rated;
          mau += Math.abs(userSimilarity[j].similarity);
        }

        if (tu / mau > 0) {
          console.log(tu / mau);
          result.push(list_productId[productIndex]);
        }
      }
    }
    return result;
  };

  const utilityMatrix = Utility_Matrix(
    data,
    display_customerId,
    display_productId
  );

  const matrix = Normalized_Utility_Matrix(utilityMatrix);
  console.log("utilityMatrix: ", utilityMatrix);

  // console.log("matrix: ", matrix);
  const similarity = Similarity_Matrix(matrix);
  // console.log("similarity: ", similarity);

  return Matrix_Y(similarity, utilityMatrix, matrix, customerId, k);
};
