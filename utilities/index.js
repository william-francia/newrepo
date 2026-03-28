const Util = {}

/* Middleware for handling errors */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* Nav */
Util.getNav = async function () {
  return []
}

/* Funtion to build HTML from vehículos*/
Util.buildVehicleDetail = function (data) {
  if (!data) return "<p>No vehicle data available</p>"

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      </div>

      <div class="vehicle-info">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p><strong>Year:</strong> ${data.inv_year}</p>
        <p><strong>Price:</strong> $${Number(data.inv_price).toLocaleString()}</p>
        <p><strong>Mileage:</strong> ${Number(data.inv_miles).toLocaleString()} miles</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
      </div>
    </div>
  `
}

module.exports = Util