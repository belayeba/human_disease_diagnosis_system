 $("#registering_factor_options_form_block").hide();
function toggle_factor_options_registration_block(id)
{
    if(!id) {
        $("#registering_factor_options_form_block").slideToggle();
    }
    else
    {
        $("#registering_factor_options_form_block").show();
    }

}
function startFactorOptions()
{
      $('#factor_options_table').DataTable().clear().destroy();
      $('#factor_options_table').dataTable({
        order: [[ 0, "desc" ]],
        columnDefs: [
            {
                name: 'description',
                width:"100%",
                orderable: true,
                searchable: true,
                targets: [0],

            },
            {
                name: 'factor',
                width:"100%",
                orderable: true,
                searchable: true,
                targets: [1],

            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" onclick=\'diplay_factor_options_update_form('+row[2]+','+row[3]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [3],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_factor_options('+row[2]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#factor_options_table").attr("data-url")
    });
}

function load_factor_options_description(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#factor_options_description_browser').html(data);
        }
    });
}

$('#factor_options_registering_form').submit(function(event) {
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
                     show_factor_options_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#factor_options_registration_success_alert").removeClass("d-block");
                    },5000);
                    startFactorOptions();
                    $('#factor_options_registering_form')[0].reset();
                    load_factor_to_factor_options_registration_form();
                }
                else if(data.code==1)
                {
                    $("#factor_options_registration_description_error").html(data.message);
                    $("#factor_options_registration_description_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_options_registration_description_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#factor_options_registration_factor_error").html(data.message);
                    $("#factor_options_registration_factor_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_options_registration_factor_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#factor_options_registration_general_error").html(data.message);
                    $("#factor_options_registration_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_options_registration_general_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_factor_options(id,description)
{
     $("#factor_options_delete_confirmation_description").html(description);
     $("#factor_options_delete_confirmation").show();
     $('#factor_options_table_parent_div').addClass('disabledbutton')
     $("#factor_options_delete_yes_btn_id").attr("data-id",id)
}
function disable_factor_options_delete_confirmation()
{
     $("#factor_options_delete_confirmation_description").html("");
     $("#factor_options_delete_confirmation").hide();
     $('#factor_options_table_parent_div').removeClass('disabledbutton')
     $("#factor_options_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_factor_options()
{

    id= $("#factor_options_delete_yes_btn_id").attr("data-id");
    disable_factor_options_delete_confirmation();
    $.ajax({
        url:$("#factor_options_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_factor_options_notification("One data deleted successfully!",1)

                    $('#factor_options_table').DataTable().ajax.reload();
                }
                else
                {
                    show_factor_options_notification(data,2);
                }
     });
}
function show_factor_options_notification(data,type)
{
     $("#factor_options_notification").css('opacity' ,'0.7');

    $("#factor_options_notification").show();
    $("#factor_options_notification_message").html(data);
    if(type==1) {
        $("#factor_options_notification").removeClass("alert-danger");
        $("#factor_options_notification").addClass("alert-success");

    }
    else{
        $("#factor_options_notification").removeClass("alert-success");
        $("#factor_options_notification").addClass("alert-danger");
    }

    setTimeout("hide_factor_options_notification()",8000);
    $("#factor_options_notification").fadeTo(1000, 1,function(){$("#factor_options_notification").fadeTo(7000, 0.0);});

}
function hide_factor_options_notification()
{
    $("#factor_options_notification").hide();
    $("#factor_options_notification_message").html("");
    $('#factor_options_table_parent_div').removeClass('disabledbutton')
}

function diplay_factor_options_update_form(id,factor,description)
{
    $("#factor_options_update_popup").show();
    $('#factor_options_table_parent_div').addClass('disabledbutton')
    $("#factor_options_description_update").val(description);
    $("#factor_options_id_update").val(id);
    load_factor_to_factor_options_registration_form(factor);
}

function hide_factor_options_update_popup()
{
    $("#factor_options_description_update").val("");
    $("#factor_options_id_update").val("");
    $("#factor_options_update_popup").hide();
    $('#factor_options_table_parent_div').removeClass('disabledbutton')
}



$('#factor_options_update_form').submit(function(event) {
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
                    hide_factor_options_update_popup();
                    show_factor_options_notification("One data updated successfully!",1);
                    $('#factor_options_update_form')[0].reset();
                     startFactorOptions();
                }
                else if(data.code==1)
                {
                    $("#factor_options_update_description_error").html(data.message);
                    $("#factor_options_update_description_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_options_update_description_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#factor_options_update_factor_error").html(data.message);
                    $("#factor_options_update_factor_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_options_update_factor_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#factor_options_update_general_error").html(data.message);
                    $("#factor_options_update_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#factor_options_update_general_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function load_factor_to_factor_options_registration_form(id)
{
    var data={'csrfmiddlewaretoken':csrf_token};
    if(id)
    {
        var data={'csrfmiddlewaretoken':csrf_token,id:id};
    }
    url=$("#factor_options_registration_factor_dropdown").attr("data-url");
     $.ajax({
        url:url,
         type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(id)
            {
                $("#factor_options_update_factor_dropdown").html(data);
                document.getElementById("factor_options_update_factor_dropdown").fstdropdown.rebind();
            }
            else
            {
                 $("#factor_options_registration_factor_dropdown").html(data);
                 document.getElementById("factor_options_registration_factor_dropdown").fstdropdown.rebind();
            }

        }
    });
}
load_factor_to_factor_options_registration_form();