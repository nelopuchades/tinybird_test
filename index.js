"use strict";

let vendor = "";
let payType = "";
let withTip = null;
let fromDate = "2017-01-01";
let toDate = "2017-12-31";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const fromDateInput = document.getElementById("time-from");
const toDateInput = document.getElementById("time-to");
const tipCheckbox = document.getElementById("tip");

const refreshData = async () => {
  const url = new URL(
    "https://api.tinybird.co/v0/pipes/yellow_tripdata_2017_pipe.json"
  );
  url.searchParams.append(
    "q",
    `
    select sum(total_amount) as total_amount,
    count(*) as total_trips,
    sum(trip_distance) as total_distance,
    avg(trip_distance) as avg_trip_distance,
    avg(datediff(minute, tpep_pickup_datetime, tpep_dropoff_datetime)) as avg_trip_time
    from _ where tpep_pickup_datetime between '${fromDate} 00:00:00' and '${toDate} 23:59:59'
    ${vendor !== "" ? `and vendorid=${vendor}` : ""}
    ${payType !== "" ? `and payment_type=${payType}` : ""}
    ${withTip ? "and tip_amount>0" : ""}
    `
  );
  const result = await fetch(url, {
    headers: new Headers({
      Authorization:
        "Bearer p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c",
    }),
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (result && result.data) {
    const data = result.data[0];
    document.getElementById(
      "total_trips"
    ).innerHTML = `${data.total_trips.toLocaleString()} trips`;
    document.getElementById("total_amount").innerHTML = formatter.format(
      data.total_amount
    );
    document.getElementById("cost_per_trip").innerHTML = formatter.format(
      data.total_trips ? data.total_amount / data.total_trips : 0
    );
    document.getElementById(
      "distance"
    ).innerHTML = `${data.avg_trip_distance.toFixed(2)} miles`;
    document.getElementById("cost_per_mile").innerHTML = formatter.format(
      data.total_distance / data.total_amount
    );
    document.getElementById(
      "duration"
    ).innerHTML = `${data.avg_trip_time.toFixed(2)} mins`;
  }
};

const resetParams = (paramToDelete) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (paramToDelete) searchParams.delete(paramToDelete);
  const newURL = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState(null, "", newURL);
};

const setQueryParam = (queryParam, queryValue) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(queryParam, queryValue);
  const newURL = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState(null, "", newURL);
};

const onBodyLoad = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const selectedVendor = searchParams.get("driver");
  if (selectedVendor) {
    vendor = selectedVendor;
    switch (selectedVendor) {
      case "1":
      case "2":
        document.getElementById(`vendor-${selectedVendor}`).checked = true;
        break;
      default:
        document.getElementById("vendor-all").checked = true;
    }
  } else {
    vendor = "";
  }

  const fromDateParam = searchParams.get("from");
  if (fromDateParam) {
    fromDate = fromDateParam;
    fromDateInput.value = fromDateParam;
  } else {
    fromDate = "2017-01-01";
    fromDateInput.value = fromDate;
  }

  const toDateParam = searchParams.get("to");
  if (toDateParam) {
    toDate = toDateParam;
    toDateInput.value = toDateParam;
  } else {
    toDate = "2017-12-31";
    toDateInput.value = toDate;
  }

  const payTypeSelected = searchParams.get("pay_type");
  if (payTypeSelected) {
    payType = payTypeSelected;
    switch (payTypeSelected) {
      case "1":
      case "2":
        document.getElementById(`pay-type-${payTypeSelected}`).checked = true;
        break;
      default:
        document.getElementById("pay-type-all").checked = true;
    }
  } else {
    payType = "";
  }

  const withTipParam = searchParams.get("with_tip");
  if (withTipParam) {
    withTip = withTipParam;
    tipCheckbox.checked = withTipParam;
  } else {
    withTip = null;
    tipCheckbox.checked = false;
  }

  refreshData();
};

const onVendorChangeHandler = (e) => {
  const vendorSelected = e.target.value;
  vendor = vendorSelected;

  if (vendorSelected) {
    setQueryParam("driver", vendorSelected);
  } else {
    resetParams("driver");
  }

  refreshData();
};

const onPayTypeChangeHandler = (e) => {
  const payTypeSelected = e.target.value;
  payType = payTypeSelected;

  if (payTypeSelected) {
    setQueryParam("pay_type", payTypeSelected);
  } else {
    resetParams("pay_type");
  }

  refreshData();
};

const onDateChangeHandler = (e, dateDirection) => {
  const date = e.target.value;
  if (dateDirection === "from") {
    fromDate = date;
    toDateInput.min = date;
  } else {
    toDate = date;
    fromDateInput.max = date;
  }

  if (date) {
    setQueryParam(dateDirection, date);
  } else {
    resetParams(dateDirection);
  }

  refreshData();
};

const onTipChangeHandler = () => {
  const isChecked = tipCheckbox.checked;

  if (isChecked) {
    withTip = isChecked;
    setQueryParam("with_tip", isChecked);
  } else {
    withTip = null;
    resetParams("with_tip");
  }

  refreshData();
};

fromDateInput.addEventListener("change", (e) => onDateChangeHandler(e, "from"));
toDateInput.addEventListener("change", (e) => onDateChangeHandler(e, "to"));
tipCheckbox.addEventListener("input", onTipChangeHandler);

document.getElementsByName("vendor-group").forEach((radioInput) => {
  radioInput.addEventListener("click", onVendorChangeHandler);
});

document.getElementsByName("pay-type-group").forEach((radioInput) => {
  radioInput.addEventListener("click", onPayTypeChangeHandler);
});
