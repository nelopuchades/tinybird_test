'use strict';

let vendor = '';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const getData = async () => {
  const url = new URL('https://api.tinybird.co/v0/pipes/yellow_tripdata_2017_pipe.json');
  url.searchParams.append(
    'q',
    `
    select sum(total_amount) as total_earnings,
    avg(trip_distance) as avg_trip_distance
    from _
    ${vendor === '' ? '' : `where vendorid=${vendor}`}
    `
  );
  const result = await fetch(url, {
    headers: new Headers({
      Authorization:
        'Bearer p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c',
    }),
  })
    .then((r) => r.json())
    .then((r) => r)
    .catch((e) => e.toString());

  if (result && result.data) {
    const data = result.data[0];
    document.getElementById('total').innerHTML = formatter.format(data.total_earnings);
    document.getElementById('distance').innerHTML = `${data.avg_trip_distance.toFixed(2)} miles`;
  }
};

const vendorClickHandler = (e) => {
  const vendorSelected = e.target.value;
  vendor = vendorSelected;

  if (vendorSelected) {
    setQueryParam('driver', vendorSelected ? vendorSelected : null);
  } else {
    resetParams();
  }

  getData();
};

const resetParams = () => {
  history.pushState(null, '', window.location.pathname);
};

const setQueryParam = (queryParam, queryValue) => {
  const searchParams = new URLSearchParams(window.location[queryParam]);
  searchParams.set(queryParam, queryValue);
  const newURL = window.location.pathname + '?' + searchParams.toString();
  history.pushState(null, '', newURL);
};

const onBodyLoad = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const selectedVendor = searchParams.get('driver');
  if (selectedVendor) {
    vendor = selectedVendor;
    switch (selectedVendor) {
      case '1':
      case '2':
        document.getElementById(`vendor-${selectedVendor}`).checked = true;
        break;
      default:
        document.getElementById('vendor-all').checked = true;
    }
  } else {
    vendor = '';
  }
  getData();
};

document.getElementsByName('vendor-group').forEach((radioInput) => {
  radioInput.addEventListener('click', vendorClickHandler);
});
