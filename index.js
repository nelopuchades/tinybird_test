'use strict';

let vendor = '';
let fromDate = '2017-01-01';
let toDate = '2017-12-31';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const fromDateInput = document.getElementById('time-from');

const areParamsSetted = () => {
  return vendor !== '' && fromDate !== '';
};

const getData = async () => {
  const url = new URL('https://api.tinybird.co/v0/pipes/yellow_tripdata_2017_pipe.json');
  url.searchParams.append(
    'q',
    `
    select sum(total_amount) as total_earnings,
    avg(trip_distance) as avg_trip_distance
    from _ where tpep_pickup_datetime between '${fromDate} 00:00:00' and '${toDate} 23:59:59'
    ${vendor !== '' ? `and vendorid=${vendor}` : ''}
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

const resetParams = (paramToDelete) => {
  const searchParams = new URLSearchParams(window.location.search);
  if (paramToDelete) searchParams.delete(paramToDelete);
  const newURL = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState(null, '', newURL);
};

const setQueryParam = (queryParam, queryValue) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(queryParam, queryValue);
  const newURL = `${window.location.pathname}?${searchParams.toString()}`;
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

  const fromDateParam = searchParams.get('from');
  if (fromDateParam) {
    fromDate = fromDateParam;
    fromDateInput.value = fromDateParam;
  } else {
    fromDate = '2017-01-01';
    fromDateInput.value = fromDate;
  }

  getData();
};

const vendorClickHandler = (e) => {
  const vendorSelected = e.target.value;
  vendor = vendorSelected;

  if (vendorSelected) {
    setQueryParam('driver', vendorSelected);
  } else {
    resetParams('driver');
  }

  getData();
};

const onDateChangeHandler = (e, dateDirection) => {
  const date = e.target.value;
  fromDate = date;

  if (date) {
    setQueryParam('from', date);
  } else {
    resetParams('from');
  }

  getData();
};

fromDateInput.addEventListener('change', (e) => onDateChangeHandler(e, 'from'));

document.getElementsByName('vendor-group').forEach((radioInput) => {
  radioInput.addEventListener('click', vendorClickHandler);
});
