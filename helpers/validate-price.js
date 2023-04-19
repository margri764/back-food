

function validatePrice(data) {

   const price = data.price;
   const stockQuantity = data.stockQuantity;

  
    // Verificar que "price" y "stockQuantity" sean números y sean mayores que 1
    const priceNumber = Number(price);
    const stockQuantityNumber = Number(stockQuantity);

    console.log(priceNumber, stockQuantityNumber);
    if (isNaN(priceNumber) || priceNumber < 1) {
      return {
        success: false,
        message: `El precio tiene que ser un número mayor a 1. "${price}" no es un número válido.`,
      };
    }
    if (isNaN(stockQuantityNumber) || stockQuantityNumber < 1) {
      return {
        success: false,
        message: `La cantidad de stock tiene que ser un número mayor a 1. "${stockQuantity}" no es un número válido.`,
      };
    }
  
    // Sanitizar los valores de "price" y "stockQuantity" como números
    data.price = priceNumber;
    data.stockQuantity = stockQuantityNumber;
  
    return { success: true };
  }
  
  module.exports = validatePrice;
  