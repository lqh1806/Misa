$(document).ready(function () {
  loadData();
  setEvents();
});

function setEvents() {
  //Mo dialog
  $('.btn-them').click(function () {
    $('.dialog').show();
  });

  //Dong dialog
  $('.exit').click(function () {
    $('.dialog').hide();
  });

  //Luu thong tin nguoi dung moi
  $('#btnSave').click(function () {
    var customer = getUserDataInput();
    console.log(customer);
    $.ajax({
      method: 'POST',
      url: 'http://api.manhnv.net/api/customers',
      async: false,
      data: JSON.stringify(customer),
      contentType: 'application/json',
    })
      .done(function (response) {
        alert('Thanh cong');
        $('.dialog').hide();
        loadData();
      })
      .fail(function (response) {
        alert(response.responseText);
      });
  });

  //Click 1 dòng của table để chuyển màu
  $('table tbody tr').click(function () {
    $(this).siblings('.tr-background').removeClass('tr-background');
    $(this).addClass('tr-background');
  });

  //Sự kiện nút xóa
  $('.delete').click(function () {
    var id = $('#tblListCustomer tbody tr.tr-background').data('recordID');
    var result = confirm('Bạn có muốn xóa?');
    if (result) {
      $.ajax({
        method: 'DELETE',
        url: 'http://api.manhnv.net/api/customers/' + id,
      })
        .done(function (response) {
          alert('Bạn đã xóa thành công');
          loadData();
        })
        .fail(function (response) {
          alert('Không xóa thành công');
        });
    }
  });

  //Gán sự kiện dbl click cho tr
  $('table#tblListCustomer').on('dblclick', 'tbody tr', rowOnDblClick);
}

function rowOnDblClick() {
  var id = $(this).data('recordID');
  $.ajax({
    method: 'GET',
    url: 'http://api.manhnv.net/api/customers/' + id,
    async: false,
    contentType: 'application/json',
  })
    .done(function (response) {
      var customer = response;
      bindingDialog(customer);
    })
    .fail(function (response) {
      alert(response.responseText);
    });

  $('.dialog').show();
}

//Binding dữ liệu lên dialog
function bindingDialog(customer) {
  $('#txtCustomerCode').val(customer.CustomerCode);
  $('#txtFullName').val(customer.FullName);
  $('#email').val(customer.Email);
  $('#sdt').val(customer.PhoneNumber);
  selectCustomerGroup(customer.CustomerGroupName);
  selectGenderName(customer.GenderName);
  $('#ngaysinh').val(formatDate2(customer.DateOfBirth));
}

//Binding nhóm khách hàng
function selectCustomerGroup(groupName) {
  if (groupName.includes('VIP'))
    document.querySelector('#nhom option:nth-child(2)').selected = true;
  else if (groupName.includes('Khách thường'))
    document.querySelector('#nhom option:nth-child(1)').selected = true;
  else if (groupName.includes('lai')) {
    document.querySelector('#nhom option:nth-child(3)').selected = true;
  } else if (groupName.includes('MISA')) {
    document.querySelector('#nhom option:nth-child(4)').selected = true;
  }
}

//Binding genderName
function selectGenderName(genderName) {
  if (genderName == 'Nam') {
    document.getElementById('male').checked = true;
  } else if (genderName == 'Nữ') {
    document.getElementById('female').checked = true;
  } else {
    document.getElementById('different').checked = true;
  }
}

/**
 * Get data tu API
 */
function getData() {
  var customer = null;
  $.ajax({
    method: 'GET',
    url: 'http://api.manhnv.net/api/customers',
    async: false,
    data: null,
    ceontentType: 'application/json',
  })
    .done(function (response) {
      customer = response;
    })
    .fail(function (response) {
      alert(response.responseText);
    });
  console.log(customer);
  return customer;
}

/**
 * Load data len table
 */
function loadData() {
  $('#tblListCustomer tbody').html('');
  var customer = getData();
  $.each(customer, function (index, customer) {
    var dateFormat = formatDate(customer.DateOfBirth);
    var trHTML = $(`
      <tr>
        <td>${customer.CustomerCode}</td>
        <td>${customer.FullName}</td>
        <td>${customer.GenderName}</td>
        <td>${dateFormat}</td>
        <td>${customer.CustomerGroupName}</td>
        <td>${customer.PhoneNumber}</td>
        <td>${customer.Email}</td>
      </tr>
    `);
    $('#tblListCustomer tbody').append(trHTML);
    trHTML.data('recordID', customer.CustomerId);
    trHTML.data('record', customer);
  });
}

/**
 * Format date
 */
function formatDate(date) {
  var date = new Date(date);
  var dateString = date.getDate();
  if (dateString < 10) dateString = '0' + dateString;
  var monthString = date.getMonth() + 1;
  if (monthString < 10) monthString = '0' + monthString;
  var yearString = date.getFullYear();
  return `${dateString}-${monthString}-${yearString}`;
}

function formatDate2(date) {
  var date = new Date(date);
  var dateString = date.getDate();
  if (dateString < 10) dateString = '0' + dateString;
  var monthString = date.getMonth() + 1;
  if (monthString < 10) monthString = '0' + monthString;
  var yearString = date.getFullYear();
  return `${yearString}-${monthString}-${dateString}`;
}

/**
 * Get user data input
 */
function getUserDataInput() {
  let customerCode = $('#txtCustomerCode').val();
  let fullName = $('#txtFullName').val();
  let groupName = $('#nhom option:selected').text();

  let d = $('#ngaysinh').val().split('-').reverse();
  console.log(d);
  let date = new Date(d[2], d[1] - 1, d[0]);

  let gender = Number($('.radio-btn input:checked').val());
  let genderName = null;
  if (gender == 1) {
    genderName = 'Nam';
  } else if (gender == 0) {
    genderName = 'Nữ';
  } else {
    genderName = 'Khác';
  }

  let phone = $('#sdt').val();
  let email = $('#email').val();

  let user = {
    CustomerCode: customerCode,
    FullName: fullName,
    Gender: gender,
    Address: 'Trung Van',
    DateOfBirth: date,
    Email: email,
    PhoneNumber: phone,
    CustomerGroupId: '0cb5da7c-59cd-4953-b17e-c9adc9161663',
    DebitAmount: null,
    MemberCardCode: null,
    CompanyName: null,
    CompanyTaxCode: null,
    IsStopFollow: false,
    CustomerGroupName: groupName,
    GenderName: genderName,
    MISAEntityState: 0,
  };
  return user;
}
