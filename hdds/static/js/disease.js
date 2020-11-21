 $("#registering_disease_form_block").hide();
function toggle_disease_registration_block()
{
    $("#registering_disease_form_block").slideToggle();

}
function startDisease()
{
      $('#disease_table').DataTable().clear().destroy();
      $('#disease_table').dataTable({
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
                name: 'disease category',
                width:"100%",
                orderable: true,
                searchable: true,
                targets: [1],

            },
            {
                name: 'pathogen',
                width:"100%",
                orderable: true,
                searchable: true,
                targets: [2],

            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [3],
                mRender: function (data, type, row ) {
                    return '<a href="#" onclick=\'diplay_disease_update_form('+row[3]+','+row[4]+','+row[5]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [4],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_disease('+row[3]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#disease_table").attr("data-url")
    });
}

function load_disease_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#disease_name_browser').html(data);
        }
    });
}

$('#disease_registering_form').submit(function(event) {
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
                     show_disease_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#disease_registration_success_alert").removeClass("d-block");
                    },5000);
                    startDisease();
                    $('#disease_registering_form')[0].reset();
                    load_disease_category_to_disease_registration_form();
                    load_pathogen_to_disease_registration_form();
                }
                else if(data.code==1)
                {
                    $("#disease_registration_name_error").html(data.message);
                    $("#disease_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_registration_name_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#disease_registration_category_error").html(data.message);
                    $("#disease_registration_category_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_registration_category_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#disease_registration_pathogen_error").html(data.message);
                    $("#disease_registration_pathogen_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_registration_pathogen_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==4)
                {
                    $("#disease_registration_general_error").html(data.message);
                    $("#disease_registration_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_registration_general_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_disease(id,name)
{
     $("#disease_delete_confirmation_name").html(name);
     $("#disease_delete_confirmation").show();
     $('#disease_table_parent_div').addClass('disabledbutton')
     $("#disease_delete_yes_btn_id").attr("data-id",id)
}
function disable_disease_delete_confirmation()
{
     $("#disease_delete_confirmation_name").html("");
     $("#disease_delete_confirmation").hide();
     $('#disease_table_parent_div').removeClass('disabledbutton')
     $("#disease_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_disease()
{

    id= $("#disease_delete_yes_btn_id").attr("data-id");
    disable_disease_delete_confirmation();
    $.ajax({
        url:$("#disease_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_disease_notification("One data deleted successfully!",1)

                    $('#disease_table').DataTable().ajax.reload();
                }
                else
                {
                    show_disease_notification(data,2);
                }
     });
}
function show_disease_notification(data,type)
{
     $("#disease_notification").css('opacity' ,'0.7');

    $("#disease_notification").show();
    $("#disease_notification_message").html(data);
    if(type==1) {
        $("#disease_notification").removeClass("alert-danger");
        $("#disease_notification").addClass("alert-success");

    }
    else{
        $("#disease_notification").removeClass("alert-success");
        $("#disease_notification").addClass("alert-danger");
    }

    setTimeout("hide_disease_notification()",8000);
    $("#disease_notification").fadeTo(1000, 1,function(){$("#disease_notification").fadeTo(7000, 0.0);});

}
function hide_disease_notification()
{
    $("#disease_notification").hide();
    $("#disease_notification_message").html("");
    $('#disease_table_parent_div').removeClass('disabledbutton')
}

function diplay_disease_update_form(id,category,pathogen,name)
{
    $("#disease_update_popup").show();
    $('#disease_table_parent_div').addClass('disabledbutton')
    $("#disease_name_update").val(name);
    $("#disease_id_update").val(id);
    load_disease_category_to_disease_registration_form(category);
    load_pathogen_to_disease_registration_form(pathogen);
}

function hide_disease_update_popup()
{
    $("#disease_name_update").val("");
    $("#disease_id_update").val("");
    $("#disease_update_popup").hide();
    $('#disease_table_parent_div').removeClass('disabledbutton')
}



$('#disease_update_form').submit(function(event) {
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
                    hide_disease_update_popup();
                    show_disease_notification("One data updated successfully!",1);
                    $('#disease_update_form')[0].reset();
                     startDisease();
                }
                else if(data.code==1)
                {
                    $("#disease_update_name_error").html(data.message);
                    $("#disease_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_update_name_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#disease_update_category_error").html(data.message);
                    $("#disease_update_category_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_update_category_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#disease_update_pathogen_error").html(data.message);
                    $("#disease_update_pathogen_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_update_pathogen_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==4)
                {
                    $("#disease_update_general_error").html(data.message);
                    $("#disease_update_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_update_general_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function load_disease_category_to_disease_registration_form(id)
{
     var data={'csrfmiddlewaretoken':csrf_token};
    if(id)
    {
        var data={'csrfmiddlewaretoken':csrf_token,id:id};
    }
    url=$("#disease_registration_category_dropdown").attr("data-url");
     $.ajax({
        url:url,
         type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(id)
            {
                $("#disease_update_category_dropdown").html(data);
                document.getElementById("disease_update_category_dropdown").fstdropdown.rebind();
            }
            else
            {
                 $("#disease_registration_category_dropdown").html(data);
                 document.getElementById("disease_registration_category_dropdown").fstdropdown.rebind();
            }

        }
    });
}

load_disease_category_to_disease_registration_form();

function load_pathogen_to_disease_registration_form(id)
{

     var data={'csrfmiddlewaretoken':csrf_token};
    if(id)
    {
        var data={'csrfmiddlewaretoken':csrf_token,id:id};
    }
    url=$("#disease_registration_pathogen_dropdown").attr("data-url");
     $.ajax({
        url:url,
        data:data,
         method:"post",
        dataType:"text",
        success:function(data)
        {
            if(id)
            {
                $("#disease_update_pathogen_dropdown").html(data);
                document.getElementById("disease_update_pathogen_dropdown").fstdropdown.rebind();
            }
            else
            {
                 $("#disease_registration_pathogen_dropdown").html(data);
                 document.getElementById("disease_registration_pathogen_dropdown").fstdropdown.rebind();
            }

        }
    });
}
load_pathogen_to_disease_registration_form()