"use strict";

let vendor = "";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const getData = async () => {
  const url = new URL(
    "https://api.tinybird.co/v0/pipes/yellow_tripdata_2017_pipe.json"
  );
  url.searchParams.append(
    "q",
    `
    select sum(total_amount) as total_earnings,
    avg(trip_distance) as avg_trip_distance
    from _
    ${vendor === "" ? "" : `where vendorid=${vendor}`}
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
    document.getElementById("total").innerHTML = `💰 ${formatter.format(
      data.total_earnings
    )}`;
  }
};

getData();

const vendorClickHandler = (e) => {
  const vendorSelected = e.target.value;
  vendor = vendorSelected;
  getData();
};

document.getElementsByName("vendor-group").forEach((radioInput) => {
  radioInput.addEventListener("click", vendorClickHandler);
});
