

function startDiseaseDetail()
{
      $('#disease_detail_table').DataTable().clear().destroy();
      $('#disease_detail_table').dataTable({
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
                    return '<b>|</b>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" onclick=\'update_disease_detail("'+row[0]+'",'+row[1]+');\'><ins>Factor_and_symptom</ins></a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [3],
                mRender: function (data, type, row ) {
                    return '<b>|</b>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [4],
                mRender: function (data, type, row ) {
                    return '<a href="#" onclick=\'update_disease_prescription("'+row[0]+'",'+row[1]+');\'><ins>Prescription</ins></a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [5],
                mRender: function (data, type, row ) {
                    return '<b>|</b>'; }
            },
        ],
        searching: true,
        processing: true,
        serverSide: true,
        stateSave: true,
        ajax: $("#disease_detail_table").attr("data-url")
    });
}
function  update_disease_detail(name,id)
{
     $("#selected_disease_id").html(name);
     $("#selected_disease_id_for_add_symptom").val(id);
     switch_disease_data_management(12);
     $('#symptom_add_to_disease_detail_div').hide();
     $('#factor_add_to_disease_detail_div').hide();
     load_disease_symptom_and_factor();
}

function load_disease_symptom_and_factor()
{
    var id= $("#selected_disease_id_for_add_symptom").val();
        $.ajax({
            type        : 'POST',
            url         : $("#selected_disease_id_for_add_symptom").attr('data-url'),
            data        : {id:id,'csrfmiddlewaretoken':csrf_token},
            dataType    : 'json',
            encode      : true
        })
            .done(function(data) {
                if(data.code==0)
                {
                   alert(data.message);
                }
                else
                {
                     $("#selected_disease_symptoms").html(data.symptom);
                     $("#selected_disease_factors").html(data.factor);
                }

            });
}



function load_symptom_category_to_disease_detail_form()
{
    var data={'csrfmiddlewaretoken':csrf_token};
    url=$("#symptom_registration_category_dropdown").attr("data-url");
     $.ajax({
        url:url,
         type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            $("#symptom_category_for_add_disease_detail_dropdown").html(data);
            document.getElementById("symptom_category_for_add_disease_detail_dropdown").fstdropdown.rebind();
            load_symptom_to_disease_detail_form();
        }
    });
}


function load_symptom_to_disease_detail_form()
{
    var data={'csrfmiddlewaretoken':csrf_token , category:$("#symptom_category_for_add_disease_detail_dropdown").val() };
    url=$("#symptom_for_add_disease_detail_dropdown").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            $("#symptom_for_add_disease_detail_dropdown").html(data);
            document.getElementById("symptom_for_add_disease_detail_dropdown").fstdropdown.rebind();
        }
    });
}



function load_medicine_with_type_for_prescription()
{

    //var data={'csrfmiddlewaretoken':csrf_token , category:$("#symptom_category_for_add_disease_detail_dropdown").val() };
    url=$("#symptom_for_add_disease_prescription_dropdown").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        dataType:"text",
        success:function(data)
        {
            $("#symptom_for_add_disease_prescription_dropdown").html(data);
            document.getElementById("symptom_for_add_disease_prescription_dropdown").fstdropdown.rebind();
        }
    });
}




function add_symptom_to_disease()
{
     var data={'csrfmiddlewaretoken':csrf_token,
         "symptom":$("#symptom_for_add_disease_detail_dropdown").val(),
         "disease":$("#selected_disease_id_for_add_symptom").val(),
         "isMust":$("#status_for_add_disease_detail_dropdown").val()};
     $.ajax({
        url:$("#add_symptom_to_disease_btn").attr("data-url"),
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(data=="yes")
            {
                  $("#symptom_add_message").html("<span style='color:green'>One symptom added!</span>");
                  load_symptom_category_to_disease_detail_form();
                  $("#status_for_add_disease_detail_dropdown").val(2)
                  load_disease_symptom_and_factor();
            }
            else
            {
                  $("#symptom_add_message").html("<span style='color:red'>"+data+"</span>");
            }
            setTimeout('$("#symptom_add_message").html("")',5000);
        }
    });
}
function remove_symptom_from_disease(id)
{
     var data={'csrfmiddlewaretoken':csrf_token,
         "symptom":id,
         "disease":$("#selected_disease_id_for_add_symptom").val(),
        };
     $.ajax({
        url:$("#remove_symptom_from_disease_url").attr("data-url"),
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(data=="yes")
            {
                  load_disease_symptom_and_factor();
            }
            else
            {
                  alert(data);
            }
            setTimeout('$("#symptom_add_message").html("")',5000);
        }
    });
}
function display_delete_symptom_from_disease_confirmation(id)
{
    $("#delete_symptom_from_disease_confirmation_"+id).show();
}
function hidden_delete_symptom_from_disease_confirmation(id)
{
    $("#delete_symptom_from_disease_confirmation_"+id).hide();
}













function load_factor_to_disease_detail_form()
{
    var data={'csrfmiddlewaretoken':csrf_token};
    url=$("#factor_options_registration_factor_dropdown").attr("data-url");
     $.ajax({
        url:url,
         type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            $("#factor_for_add_disease_detail_dropdown").html(data);
            document.getElementById("factor_for_add_disease_detail_dropdown").fstdropdown.rebind();
            load_factor_option_to_disease_detail_form();
        }
    });
}


function load_factor_option_to_disease_detail_form()
{
    var data={'csrfmiddlewaretoken':csrf_token , factor:$("#factor_for_add_disease_detail_dropdown").val() };
    url=$("#factor_option_for_add_disease_detail_dropdown").attr("data-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            $("#factor_option_for_add_disease_detail_dropdown").html(data);
            document.getElementById("factor_option_for_add_disease_detail_dropdown").fstdropdown.rebind();
        }
    });
}

function add_factor_option_to_disease()
{
     var data={'csrfmiddlewaretoken':csrf_token,
         "factor_option":$("#factor_option_for_add_disease_detail_dropdown").val(),
         "disease":$("#selected_disease_id_for_add_symptom").val(),
         "status":$("#status_of_factor_to_add_to_disease").val()};
     $.ajax({
        url:$("#add_factor_option_to_disease_btn").attr("data-url"),
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(data=="yes")
            {
                  $("#factor_option_add_message").html("<span style='color:green'>One factor added!</span>");
                  load_factor_to_disease_detail_form()
                  $("#status_of_factor_to_add_to_disease").val(1)
                  load_disease_symptom_and_factor();
            }
            else
            {
                  $("#factor_option_add_message").html("<span style='color:red'>"+data+"</span>");
            }
            setTimeout('$("#factor_option_add_message").html("")',5000);
        }
    });
}


function remove_factor_option_from_disease(id)
{
     var data={'csrfmiddlewaretoken':csrf_token,
         "factor_option":id,
         "disease":$("#selected_disease_id_for_add_symptom").val(),
         };
     $.ajax({
        url:$("#remove_factor_option_from_disease_url").attr("data-url"),
        type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(data=="yes")
            {
                  load_disease_symptom_and_factor();
            }
            else
            {
                  alert(data);
            }
            setTimeout('$("#factor_option_add_message").html("")',5000);
        }
    });
}
function display_delete_factor_option_from_disease_confirmation(id)
{
    $("#delete_factor_option_from_disease_confirmation_"+id).show();
}
function hidden_delete_factor_option_from_disease_confirmation(id)
{
    $("#delete_factor_option_from_disease_confirmation_"+id).hide();
}























function load_disease_prescription()
{
    var id= $("#selected_disease_id_for_prescription").val();
        $.ajax({
            type        : 'POST',
            url         : $("#selected_disease_id_for_prescription").attr('data-url'),
            data        : {disease:id,'csrfmiddlewaretoken':csrf_token},
            dataType    : 'text',
            encode      : true
        })
            .done(function(data) {

                $("#selected_disease_prescriptions_saved_data").html(data);
                $(".factor_drop_downselect2").select2({ width: '100%'  });
                load_factor_option_to_adding_factor_to_prescribed_medicine();
            });
}



function load_factor_option_to_prescription_form()
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
            $("#factors_option_dropdown_for_prescription").html(data);
            document.getElementById("factors_option_dropdown_for_prescription").fstdropdown.rebind();
        }
    });
}


function  update_disease_prescription(name,id)
{
     $("#selected_disease_id2").html(name);
     $("#selected_disease_id_for_prescription").val(id);
     switch_disease_data_management(18);
     $("#disease_prescription_id").val(id);
     $('#prescription_add_to_disease_detail_div').hide();
     load_disease_prescription();
}


function select_and_add_factor_to_prescription(val,cont)
{
    if ($("#deletetable_factor_options_for_prescription_" + val).length > 0)
    {
        $("#single_selected_factor_first_part_" + val).css("border", "2px solid blue");
        $("#single_selected_factor_second_part_" + val).css("border", "2px solid blue");
        var m = val;
        setTimeout(function () {
            $("#single_selected_factor_first_part_" + m).css("border", "1px solid lightgrey");
            $("#single_selected_factor_second_part_" + m).css("border", "1px solid lightgrey");
        }, 3000);
        load_factor_option_to_prescription_form();
        return;
    }
    $("#factors_container")
        .append($("#factor_adding_to_prescription_template")
            .html()
            .replace("No added factor", cont)
            .replace(/idd/g, val));
    $("#hiddennable-factor-message").hide();
    load_factor_option_to_prescription_form();
}

function delete_factor_for_prescription_from_form(id) {
    $("#deletetable_factor_options_for_prescription_"+id).remove();
    if ($(".factor-template").length < 2)
    {
        $("#hiddennable-factor-message").show();
    }
}


function load_medicine_for_prescription_form()
{
    var data={'csrfmiddlewaretoken':csrf_token};
    url=$("#medicine_for_disease_prescription_form").attr("data-url");
     $.ajax({
         url:url,
         data:data,
         type:"post",
         dataType:"text",
         success:function(data)
         {
            $("#medicine_for_disease_prescription_form").html(data);
            document.getElementById("medicine_for_disease_prescription_form").fstdropdown.rebind();
            load_medicine_type_for_prescription_form();
         }
    });
}
function load_medicine_type_for_prescription_form()
{
    var data={'csrfmiddlewaretoken':csrf_token,"medicine":$("#medicine_for_disease_prescription_form").val()};
    url=$("#medicine_type_dropdown_for_disease_prescription").attr("data-url");
     $.ajax({
        url:url,
        data:data,
        dataType:"text",
        type:"post",
        success:function(data)
        {
            $("#medicine_type_dropdown_for_disease_prescription").html(data);
            document.getElementById("factors_option_dropdown_for_prescription").fstdropdown.rebind();
        }
    });
}
$("#add_disease_prescription_form").submit(function(event) {
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
                if(data.code==0)
                {
                     $(".factor-template").not("#deletetable_factor_options_for_prescription_idd").remove();
                     $("#hiddennable-factor-message").show();
                     load_medicine_for_prescription_form();
                     load_disease_prescription();
                }
                else
                {
                    $("#medicineType_registration_name_error").html(data);
                    $("#medicineType_registration_name_error").addClass("d-block");
                    setTimeout(function()
                    {
                        $("#medicineType_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });





function delete_prescription_from_disease( disease, prescription_id)
{
     var data={'csrfmiddlewaretoken':csrf_token,disease:disease,prescription_id:prescription_id};
        url=$("#prescription_related_url_container").attr("delete-prescription-url");
        $.ajax({
             url:url,
             data:data,
             type:"post",
             dataType:"text",
             success:function(data)
             {
                if(data=="yes")
                {
                    load_disease_prescription();
                }
                else
                {
                    alert(data);
                }
             }
        });
}


function delete_factor_from_prescribed_medicine( prescription_id, factor_id)
{
    var data={'csrfmiddlewaretoken':csrf_token,prescription_id:prescription_id,factor_id:factor_id};
        url=$("#prescription_related_url_container").attr("delete-factor-url");
        $.ajax({
             url:url,
             data:data,
             type:"post",
             dataType:"text",
             success:function(data)
             {
                if(data=="yes")
                {
                    load_disease_prescription();
                }
                else
                {
                    alert(data);
                }
             }
        });
}

function add_factor_to_this_prescription(prescription_id,factor_id)
{
    load_factor_option_to_adding_factor_to_prescribed_medicine();
    var data={'csrfmiddlewaretoken':csrf_token,prescription_id:prescription_id,factor_id:factor_id };
    url=$("#prescription_related_url_container").attr("add-factor-url");
     $.ajax({
        url:url,
        type:"post",
        data:data,
        dataType:"json",
        success:function(data)
        {
            if(data.code==1)
            {
                $("#add_factor_to_prescribed_mess_"+prescription_id).html(data.message);
                $("#add_factor_to_prescribed_mess_"+prescription_id).show();
                setTimeout(function(){
                         $("#add_factor_to_prescribed_mess_"+prescription_id).hide();
                    },5000);
            }
            else
            {
                 $("#factor_list_display_"+prescription_id).prepend(data.message);

            }

        }
    });
}


function load_factor_option_to_adding_factor_to_prescribed_medicine()
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
             $(".factor_drop_downselect2").html(data);
        }
    });
}