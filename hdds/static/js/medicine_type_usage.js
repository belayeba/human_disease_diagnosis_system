
$("#matching_disease_type_usage_form_block").hide();

function toggle_matching_disease_type_usage_form_block(id)
{
    if(!id)
    {
        $("#matching_disease_type_usage_form_block").slideToggle();
    }
    else
    {
        $("#matching_disease_type_usage_form_block").show();
    }
}

function startMedicineTypeUsage()
{
      $('#medicine_table_2').DataTable().clear().destroy();
      $('#medicine_table_2').dataTable({
        order: [[ 0, "desc" ]],
        columnDefs: [
            {
                name: 'name',
                width:"100%",
                orderable: true,
                searchable: true,
                targets: [0],

            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [1],
                mRender: function (data, type, row ) {
                    return '<a href="#" onclick="go_to_adding_disease_detail_data_page(\''+row[0]+"\',"+row[1]+')"><ins>select</ins></a>';
                }
            }

           // {
              //  name: 'description',
              //  orderable: true,
              //  searchable: true,
              //  targets: [1]
           // }
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: $("#medicine_table_2").attr("data-url")
    });

}
function go_to_adding_disease_detail_data_page(name,id)
{
    $('#medicine_detail_form_name').val(name);
    $('#selected_medicine_for_add_type_and_usage').val(id);
    switch_disease_data_management(15);
    $('#medicine_type_usage_id').val(id);
    reset_add_medicine_type_and_usage_form();
    load_saved_medicine_type_usage_data();
    $('#Medicine_name_display_1').html(name);
}
function reset_add_medicine_type_and_usage_form()
{
    var data={'csrfmiddlewaretoken':csrf_token };
    url=$("#selected_medicine_for_add_type_and_usage").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"json",
        success:function(data)
        {

            if(data.type)
            {
                $("#medicine_detail_type_drop_down").html(data.type);
                document.getElementById("medicine_detail_type_drop_down").fstdropdown.rebind();
                $("#medicine_detail_usage_drop_down").html(data.usage);
                document.getElementById("medicine_detail_usage_drop_down").fstdropdown.rebind();
                $("#medicine_detail_measurement_drop_down").html(data.measurement);
                document.getElementById("medicine_detail_measurement_drop_down").fstdropdown.rebind();
            }
        }
    });
}


function load_saved_medicine_type_usage_data() {
    $('#medicine_usage_type_form_template_container').prepend($('#medicine_usage_type_form_template'))
    var data={'csrfmiddlewaretoken':csrf_token , "medicine" : $('#selected_medicine_for_add_type_and_usage').val()};
    url=$("#selected_medicine_for_add_type_and_usage").attr("data-get-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
              $("#medicine_type_usage_data_display_block").html(data);
        }
    });
}




$('#matching_disease_type_usage_form').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type        : 'POST',
            url         : $(this).attr('data-url'),
            data        : formData,
            dataType    : 'json',
            encode      : true
        })
            .done(function(data) {

                if(data.code==1)
                {
                    $("#disease_type_usage_medicine_error").html(data.message);
                    $("#disease_type_usage_medicine_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_medicine_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#disease_type_usage_type_error").html(data.message);
                    $("#disease_type_usage_type_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_type_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#disease_type_usage_usage_error").html(data.message);
                    $("#disease_type_usage_usage_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_usage_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==4)
                {
                    $("#disease_type_usage_measurement_errorr").html(data.message);
                    $("#disease_type_usage_measurement_errorr").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_measurement_errorr").removeClass("d-block");
                    },5000);
                }
                else if(data.code==5)
                {
                    $("#disease_type_usage_general_error").html(data.message);
                    $("#disease_type_usage_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_general_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==6)
                {
                    $("#disease_type_usage_general_success").html(data.message);
                    $("#disease_type_usage_general_success").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_general_success").removeClass("d-block");
                    },5000);

                    load_saved_medicine_type_usage_data() ;
                }

            });

    });
function fill_update_data_to_form(id,medicine,type,usage,measurement)
{
     var data={'csrfmiddlewaretoken':csrf_token,"type":type,"usage":usage,"measurement":measurement };
      url=$("#selected_medicine_for_add_type_and_usage").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"json",
        success:function(data)
        {
            if(data.type)
            {
                $("#medicine_detail_type_drop_down_MYID").html(data.type);
                document.getElementById("medicine_detail_type_drop_down_MYID").fstdropdown.rebind();
                $("#medicine_detail_usage_drop_down_MYID").html(data.usage);
                document.getElementById("medicine_detail_usage_drop_down_MYID").fstdropdown.rebind();
                $("#medicine_detail_measurement_drop_down_MYID").html(data.measurement);
                document.getElementById("medicine_detail_measurement_drop_down_MYID").fstdropdown.rebind();
                $(".delete_medicine_detail_confirmation_table").remove();
                $("#update_medicine_usage_type_id_MYID").val(id);
                $("#update_medicine_usage_type_medicine_id").val($("#selected_medicine_for_add_type_and_usage").val());
                $('#medicine_type_usage_update_div_'+id).prepend($('#medicine_usage_type_form_template'))
                $("#medicine_type_usage_update_row_"+id).slideToggle();

            }
        }
    });
}

function confirm_delete_medicine_detail(id)
{
    $('#medicine_usage_type_form_template_container').prepend($('#medicine_usage_type_form_template'))
    $(".delete_medicine_detail_confirmation_table").remove();
    $(".update_medicine_type_usage_row").hide();
    $("#medicine_type_usage_update_row_"+id).show();
    $("#medicine_type_usage_update_div_"+id).append($("#delete_medicine_type_usage_template").html().replace("myclass","delete_medicine_detail_confirmation_table").replace("'myid'",id));

}
function cancel_delete_medicine_detail()
{
    $(".update_medicine_type_usage_row").hide();
    $(".delete_medicine_detail_confirmation_table").remove();
}

function delete_medicine_detail(id)
{
    $(".update_medicine_type_usage_row").hide();
    $(".delete_medicine_detail_confirmation_table").remove();

     var data={'csrfmiddlewaretoken':csrf_token , "id" : id};
     url=$("#delete_medicine_type_usage_template").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
              if(data=="yes")
              {
                  load_saved_medicine_type_usage_data();
              }
              else
              {
                  alert(data);
              }
        }
    });
}



$('#update_medicine_type_usage_form').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type        : 'POST',
            url         : $(this).attr('data-url'),
            data        : formData,
            dataType    : 'json',
            encode      : true
        })
            .done(function(data) {

                if(data.code==1)
                {
                    $("#disease_type_usage_medicine_error_MYID").html(data.message);
                    $("#disease_type_usage_medicine_error_MYID").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_medicine_error_MYID").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#disease_type_usage_type_error_MYID").html(data.message);
                    $("#disease_type_usage_type_error_MYID").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_type_error_MYID").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#disease_type_usage_usage_error_MYID").html(data.message);
                    $("#disease_type_usage_usage_error_MYID").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_usage_error_MYID").removeClass("d-block");
                    },5000);
                }
                else if(data.code==4)
                {
                    $("#disease_type_usage_measurement_errorr_MYID").html(data.message);
                    $("#disease_type_usage_measurement_errorr_MYID").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_measurement_errorr_MYID").removeClass("d-block");
                    },5000);
                }
                else if(data.code==5)
                {
                    $("#disease_type_usage_general_error_MYID").html(data.message);
                    $("#disease_type_usage_general_error_MYID").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_general_error_MYID").removeClass("d-block");
                    },5000);
                }
                else if(data.code==6)
                {
                    $("#disease_type_usage_general_success_MYID").html(data.message);
                    $("#disease_type_usage_general_success_MYID").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_type_usage_general_success_MYID").removeClass("d-block");
                    },5000);

                    $(".update_medicine_type_usage_row").hide();
                    load_saved_medicine_type_usage_data();
                }

            });

    });






function toggle_adding_instruction_form(medicine_type_id)
{
      $(".__ramove__instruction__form___").remove();
      $("#add_instruction_for_medicine_form_container_"+medicine_type_id).html($("#add_prescription_for_medicine_template").
                      html().replace(/idd/g,medicine_type_id).
                      replace(/remove/g,"__ramove__instruction__form___").
                      replace(/removableclass/g,"_factor_removableclass"));
      setOnSubmitForInstruction(medicine_type_id);
      load_factor_option_to_instruction_form(medicine_type_id);
}


function select_and_add_factor_to_instruction(instraction_id,val,cont)
{
    if ($("#deletetable_factor_options_for_instruction_" + val).length > 0)
    {
        $("#_single_selected_factor_first_part_" + val).css("border", "2px solid blue");
        $("#_single_selected_factor_second_part_" + val).css("border", "2px solid blue");
        var m = val;
        setTimeout(function () {
            $("#_single_selected_factor_first_part_" + m).css("border", "1px solid lightgrey");
            $("#_single_selected_factor_second_part_" + m).css("border", "1px solid lightgrey");
        }, 3000);
        load_factor_option_to_instruction_form(instraction_id);
        return;
    }
    $("#instruction_factors_container_"+instraction_id)
        .append($("#factor_adding_to_instruction_template")
            .html()
            .replace("No added factor", cont)
            .replace("myinstruction",instraction_id)
            .replace(/idd/g, val));
    $("#heddennable-instruction-factor-message_"+instraction_id).hide();
    load_factor_option_to_instruction_form(instraction_id);
}



function delete_factor_for_instruction_from_form(instruction_id,id) {
    $("#deletetable_factor_options_for_instruction_"+id).remove();
    if ($(".instruction-factor-template").length < 2)
    {
        $("#heddennable-instruction-factor-message_"+instruction_id).show();
    }
}



function load_factor_option_to_instruction_form(id)
{
    var data={'csrfmiddlewaretoken':csrf_token };
    url=$("#factor_option_for_add_disease_detail_dropdown").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            $("#factors_option_dropdown_for_instruction_"+id).html(data);
            $("#factors_option_dropdown_for_instruction_"+id).select2({width:"100%"});
        }
    });
}

var instraction_id=0;
function setOnSubmitForInstruction(id)
{
    $("#add_instruction_form_"+id).submit(function (event) {
        event.preventDefault();
        instraction_id=$(this).attr("instruction_id");
        var formData = $(this).serializeArray();
        formData.push({name: 'csrfmiddlewaretoken', value: csrf_token});
        formData.push({name:"medicine_type",value:instraction_id})
        $.ajax({
            type: 'POST',
            url: $(this).attr('data-url'),
            data: formData,
            dataType: 'json',
            encode: true
        })
            .done(function (data) {
                if (data.code == 0) {
                     $("._factor_removableclass").remove();

                     $("#heddennable-instruction-factor-message_"+instraction_id).hide();
                     $("#instraction_table_and_form_container_"+instraction_id).html(data.message);
                }
                else if (data.code == 1) {
                    $("#factor_error_message_for_instruction_"+instraction_id).html(data.message);
                    $("#factor_error_message_for_instruction_"+instraction_id).show();
                    setTimeout(function () {
                        $("#factor_error_message_for_instruction_"+instraction_id).hide();
                    }, 5000);
                }
                else if (data.code == 2) {
                    $("#perdaytake_message_for_instruction_"+instraction_id).html(data.message);
                    $("#perdaytake_message_for_instruction_"+instraction_id).show();
                    setTimeout(function () {
                        $("#perdaytake_message_for_instruction_"+instraction_id).hide();
                    }, 5000);
                }
                 else if (data.code == 4) {
                    $("#howLong_message_for_instruction_"+instraction_id).html(data.message);
                    $("#howLong_message_for_instruction_"+instraction_id).show();
                    setTimeout(function () {
                        $("#howLong_message_for_instruction_"+instraction_id).hide();
                    }, 5000);
                }
                  else if (data.code == 5) {
                    $("#general_message_for_instruction_"+instraction_id).html(data.message);
                    $("#general_message_for_instruction_"+instraction_id).show();
                    setTimeout(function () {
                        $("#howLong_message_for_instruction_"+instraction_id).hide();
                    }, 5000);
                }
            });

    });
}


function disable_instruction_form()
{
    $('.__ramove__instruction__form___').remove();
}


function remove_factor_from_saved_instruction(instruction_id,instruction_factor_id)
{
     var data={'csrfmiddlewaretoken':csrf_token,instruction_factor_id:instruction_factor_id };
    url=$("#instruction_manage_url_container").attr("remove-factor-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(data=="yes")
            {
                $("#deletable_instruction_factor_table_row_"+instruction_id+"_"+instruction_factor_id).remove();
            }
            else
            {
                alert(data);
            }
        }
    });
}




function _load_factor_option_to_instruction_form()
{
    var data={'csrfmiddlewaretoken':csrf_token };
    url=$("#factor_option_for_add_disease_detail_dropdown").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            $(".add_factor_to_save_instruction_dropdown").html(data);
            $(".add_factor_to_save_instruction_dropdown").select2({width:"100%"});
        }
    });
}


function add_factor_to_saved_instruction(instruction_id,factor_id)
{
     var data={'csrfmiddlewaretoken':csrf_token,instruction_id:instruction_id,factor_id:factor_id };
    url=$("#instruction_manage_url_container").attr("add-factor-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"json",
        success:function(data)
        {
            if(data.code==2)
            {
                $("#deletable_instruction_factor_table_row_"+instruction_id+"_"+data.message).css("border","1px solid blue");
                setTimeout(function(){$("#deletable_instruction_factor_table_row_"+instruction_id+"_"+data.message).css("border","0px solid whitesmoke");},5000)
            }
            else if(data.code==3)
            {
                  $("#factor_for_save_instruction_table_"+instruction_id).append(data.message);
            }
            else
            {
                alert(data);
            }
            _load_factor_option_to_instruction_form()
        }
    });
}



function delete_instruction(id)
{
    var data={'csrfmiddlewaretoken':csrf_token,instruction_id:id };
    url=$("#instruction_manage_url_container").attr("remove-instruction-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(data=="yes")
            {
                $("#instruction_data_row_"+id).remove();
                $("#delete_instruction_row_confirmation_"+id).remove();
            }
            else
            {
                alert(data);
            }
        }
    });
}


function update_instruction_form_display(id)
{
    $("#update_instruction_row_"+id).show();

    $(".__ramove__update__instruction__form___").remove();
      $("#update_instruction_form_displayer_"+id).html($("#update_instruction_template").
                      html().replace(/idd/g,id).replace(/perdayvalue/g,$("#perday_data_"+id).html()).
                      replace(/perdaydetaildata/g,$("#perdaydetail_data_"+id).html()).
                      replace(/howlongdata/g,$("#how_long_"+id).html()).
                      replace(/remove/g,"__ramove__update__instruction__form___"));
      setOnSubmitForUpdateInstruction(id);
}

function disable_update_instruction_form()
{
     $('.__ramove__update__instruction__form___').remove();
     $(".update_instruction_row").hide();
}
var _instraction_id=0;
function setOnSubmitForUpdateInstruction(id)
{
    $("#update_instruction_form_"+id).submit(function (event) {
        event.preventDefault();
        _instraction_id=$(this).attr("instruction_id");
        var formData = $(this).serializeArray();
        formData.push({name: 'csrfmiddlewaretoken', value: csrf_token});
        formData.push({name:"instruction_id",value:_instraction_id})
        $.ajax({
            type: 'POST',
            url: $(this).attr('data-url'),
            data: formData,
            dataType: 'json',
            encode: true
        })
            .done(function (data) {
                if (data.code == 0) {

                    $.each(formData, function(i, field) {
                           if(field.name=="perDayTake")
                           {
                               $("#perday_data_"+id).html(field.value);
                           }
                           else if(field.name=="perDayDetail")
                           {
                               $("#perdaydetail_data_"+id).html(field.value);
                           }
                           else if(field.name=="howLong")
                           {
                               $("#how_long_"+id).html(field.value);
                           }

                      });
                     disable_update_instruction_form();
                }

                else if (data.code == 1) {
                    $("#perdaytake_message_for_update_instruction_"+_instraction_id).html(data.message);
                    $("#perdaytake_message_for_update_instruction_"+_instraction_id).show();
                    setTimeout(function () {
                        $("#perdaytake_message_for_update_instruction_"+_instraction_id).hide();
                    }, 5000);
                }
                 else if (data.code == 2) {
                    $("#howLong_message_for_update_instruction_"+_instraction_id).html(data.message);
                    $("#howLong_message_for_update_instruction_"+_instraction_id).show();
                    setTimeout(function () {
                        $("#howLong_message_for_update_instruction_"+_instraction_id).hide();
                    }, 5000);
                }
                  else if (data.code == 3) {
                    $("#general_message_for_update_instruction_"+_instraction_id).html(data.message);
                    $("#general_message_for_update_instruction_"+_instraction_id).show();
                    setTimeout(function () {
                        $("#howLong_message_for_update_instruction_"+_instraction_id).hide();
                    }, 5000);
                }
            });

    });
}
