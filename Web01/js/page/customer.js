$(document).ready(function () {
  loadData();
  setEvent();
});

function setEvent() {
  //Gán sự kiện cho btn Add:

  $('.btn-them').click(function () {
    //Hiển thị dialog
    $('.dialog').show();
  });
  $('.exit').click(function () {
    $('.dialog').hide();
  });

  $('#tblListCustomer tbody tr').on('dblclick', 'td', function (e) {
    var row = e.target.parentNode;
    var tmp = [];
    tmp = row.getElementsByTagName('td');
    var customer = [];
    for (var i = 0; i < tmp.length; i++) {
      customer.push(tmp[i].innerHTML);
    }
    var [CustomerCode, FullName, gender, date, nhomKH, sdt, email] = customer;
    $('#txtCustomerCode').val(CustomerCode);
    $('#txtFullName').val(FullName);
    if (gender == 'Nam') {
      $('#male').attr('checked', 'checked');
    } else if (gender == 'Nữ') {
      $('#female').attr('checked', 'checked');
    }
    var dateRes = date.split('/');
    $('#ngaysinh').attr('value', `${dateRes[2]}-${dateRes[1]}-${dateRes[0]}`);
    $('#sdt').val(sdt);
    $('#email').val(email);
    $('.dialog').show();
    //biding dữ liệu
  });

  $(document).on('click', '#btnSave', function () {
    //Thu thập thông tin của khách hàng
    var customerCode = $('#txtCustomerCode').val();
    var fullName = $('#txtFullName').val();
    //Xử lý ngày tháng
    var date = $('#ngaysinh').val();
    var dateRes = date.split('-');
    console.log(dateRes);
    var date2 = new Date(`${dateRes[0]}-${dateRes[1]}-${dateRes[2]}`);
    console.log(date2);
    var sdt = $('#sdt').val();
    var email = $('#email').val();
    var newCustomer = {
      CustomerCode: customerCode,
      FullName: fullName,
      DateOfBirth: new Date(`${dateRes[0]}-${dateRes[1]}-${dateRes[2]}`),
      Email: email,
      PhoneNumber: sdt,
    };
    //gọi service lưu lại
    $.ajax({
      method: 'POST',
      // url: 'http://api.manhnv.net/api/customers',
      url: 'http://localhost:3000/clients',
      data: JSON.stringify(newCustomer),
      async: false,
      contentType: 'application/json',
    })
      .done(function (response) {
        alert('Success');
      })
      .fail(function (response) {
        alert('Error');
      });
  });
}
/**
 * Load dữ liệu khách hàng
 * */
function loadData() {
  // lấy dữ liệu từ Api về;
  var data = getData();
  console.table(data);
  buildDataTableHTML(data);
  // Xử lý dữ liệu:
}

/**
 * Hàm thực hiện lấy dữ liệu
 * */
function getData() {
  var customers = null;
  $.ajax({
    method: 'GET',
    // url: 'http://api.manhnv.net/api/customers',
    url: 'http://localhost:3000/clients',
    data: null,
    async: false,
    contentType: 'application/json',
  })
    .done(function (response) {
      customers = response;
    })
    .fail(function (response) {
      alert('Không thể lấy dữ liệu từ Api');
    });
  return customers;
}

/**
 * Thực hiện build bằng dữ liệu tương ứng với dữ liệu lấy từ api
 * @param {Array} data
 * @returns
 */

function buildDataTableHTML(data) {
  $('#tblListCustomer tbody').html('');
  //Lặp
  $.each(data, function (index, customer) {
    var dateOfBirth = customer.DateOfBirth;
    var dateFormat = formatDateDDMMYYYY(dateOfBirth);
    var money = 313212342342132;
    var formatMoneyy = formatMoney(money);
    var trHTML = `<tr>
                      <td>${customer.CustomerCode}</td>
                      <td>${customer.FullName}</td>
                      <td>${customer.GenderName}</td>
                      <td>${dateFormat}</td>
                      <td>${customer.CustomerGroupName}</td>
                      <td>${customer.PhoneNumber}</td>
                      <td>${customer.Email}</td>
                      <td>${formatMoneyy}</td>
                      <td><input type="checkbox" checked></td>
                    </tr>`;
    $('#tblListCustomer tbody').append(trHTML);
  });
}

/**
 * Xử lí khi truyền ngày tháng vào sẽ trả về chuỗi tring có dạng ngày/tháng/năm
 * @param {Date} data
 * @returns
 */
function formatDateDDMMYYYY(date) {
  if (!date) {
    return '';
  }
  var newDate = new Date(date);
  var dateString = newDate.getDate();
  var monthString = newDate.getMonth() + 1;
  var year = newDate.getFullYear();
  if (dateString < 10) dateString = '0' + dateString;
  if (monthString < 10) monthString = '0' + monthString;
  return `${dateString}/${monthString}/${year}`;
}

/**
 * Xử lí hiển thị tiền tệ
 * @param {Number} money
 * @returns
 */
function formatMoney(money) {
  var moneyFormat = money.toLocaleString('vi', {
    style: 'currency',
    currency: 'VND',
  });
  return moneyFormat;
}

function thoat() {
  $('.dialog').hide();
}
