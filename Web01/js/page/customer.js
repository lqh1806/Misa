$(document).ready(function(){
  loadData();
  setEvents();
})

function setEvents() {
  //Mo dialog
  $('.btn-them').click(function(){
    $('.dialog').show();
  })

  //Dong dialog
  $('.exit').click(function(){
    $('.dialog').hide();
  })

  //Luu thong tin nguoi dung moi
  $('#btnSave').click(function(){
    var customer = getUserDataInput();
    console.log(customer)
    $.ajax({
      method: 'POST',
      url: "http://api.manhnv.net/api/customers",
      async: false,
      data: JSON.stringify(customer),
      contentType: "application/json" 
    }).done(function(response){
      alert("Thanh cong");
      $('.dialog').hide();
      loadData();
    }).fail(function(response){
      alert(response.responseText);
    })
  })
}

/**
 * Get data tu API
 */
function getData() {
  var customer = null;
  $.ajax({
    method: 'GET',
    url: "http://api.manhnv.net/api/customers",
    async: false,
    data: null,
    ceontentType: 'application/json'
  }).done(function(response){
    customer = response;
  }).fail(function(response){
    alert(response.responseText);
  })
  console.log(customer);
  return customer;
}

/**
 * Load data len table
 */
function loadData(){
  $('#tblListCustomer tbody').html('');
  var customer = getData();
  $.each(customer, function(index, customer){
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
  })

}

/**
 * Format date
 */
function formatDate(date){
  var date = new Date(date);
  var dateString = date.getDate();
  if(dateString < 10) dateString = "0" + dateString;
  var monthString = date.getMonth() + 1;
  if(monthString < 10)  monthString = "0" + monthString;
  var yearString = date.getFullYear();
  return `${dateString}-${monthString}-${yearString}`;
}

/**
 * Get user data input
 */
function getUserDataInput(){
  let customerCode = $('#txtCustomerCode').val();
  let fullName = $('#txtFullName').val();
  let groupName = $('#nhom option:selected').text();

  let d = $('#ngaysinh').val().split('-').reverse();
  console.log(d);
  let date = new Date(d[2], d[1]-1, d[0]);

  let gender = Number($('.radio-btn input:checked').val());
  let genderName = null;
  if(gender == 1){
    genderName = "Nam"
  }
  else if(gender == 0){
    genderName = "Nữ"
  }
  else{
    genderName = "Khác"
  }

  let phone = $('#sdt').val();
  let email = $("#email").val();

  let user = {
        CustomerCode: customerCode,
        FullName: fullName,
        Gender: gender,
        Address: "Trung Van",
        DateOfBirth: date,
        Email: email,
        PhoneNumber: phone,
        CustomerGroupId: "7a0b757e-41eb-4df6-c6f8-494a84b910f4",
        DebitAmount: null,
        MemberCardCode: null,
        CompanyName: null,
        CompanyTaxCode: null,
        IsStopFollow: false,
        CustomerGroupName: groupName,
        GenderName: genderName,
        MISAEntityState: 0
  }
  return user;
}