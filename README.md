# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


<div className="col-md-12">
      <div className="wetherBg">
        <h1 className="heading">Weather App</h1>

        <div className="d-grid gap-3 col-4 mt-4">
          <input
            type="text"
            className="form-control"
            value={inputCity}
            onChange={handleChangeInput}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Display weather information if data is available */}

      {Object.keys(data).length > 0 && (
        <div className="col-md-12 text-center mt-4">
          <div className="shadow rounded wetherResultBox p-5">
            <h5 className="weathorCity">{data?.name}</h5>
            <div className="detail mt-4 ">
              <div className="box">
                <h6 className="weathorTemp">
                  {(data?.main?.temp - 273.15).toFixed(2)}°C
                </h6>
                <p>Temperature</p>
              </div>
              <div className="box">
                <h6 className="weathorTemp">
                  {(data?.wind?.speed).toFixed(2)} mph
                </h6>
                <p>Wind Speed</p>
              </div>
              <div className="box">
                <h6 className="weathorTemp">
                  {(data?.main?.humidity).toFixed(2)} %
                </h6>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>