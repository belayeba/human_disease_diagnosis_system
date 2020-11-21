 $("#registering_symptom_form_block").hide();
function toggle_symptom_registration_block()
{
    $("#registering_symptom_form_block").slideToggle();

}
function startSymptom()
{
      $('#symptom_table').DataTable().clear().destroy();
      $('#symptom_table').dataTable({
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
                name: 'symptom category',
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
                    return '<a href="#" onclick=\'diplay_symptom_update_form('+row[2]+','+row[3]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [3],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_symptom('+row[2]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#symptom_table").attr("data-url")
    });
}

function load_symptom_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#symptom_name_browser').html(data);
        }
    });
}

$('#symptom_registering_form').submit(function(event) {
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
                     show_symptom_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#symptom_registration_success_alert").removeClass("d-block");
                    },5000);
                    startSymptom();
                    $('#symptom_registering_form')[0].reset();
                    load_symptom_category_to_symptom_registration_form();
                }
                else if(data.code==1)
                {
                    $("#symptom_registration_name_error").html(data.message);
                    $("#symptom_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_registration_name_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#symptom_registration_category_error").html(data.message);
                    $("#symptom_registration_category_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_registration_category_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#symptom_registration_general_error").html(data.message);
                    $("#symptom_registration_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_registration_general_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_symptom(id,name)
{
     $("#symptom_delete_confirmation_name").html(name);
     $("#symptom_delete_confirmation").show();
     $('#symptom_table_parent_div').addClass('disabledbutton')
     $("#symptom_delete_yes_btn_id").attr("data-id",id)
}
function disable_symptom_delete_confirmation()
{
     $("#symptom_delete_confirmation_name").html("");
     $("#symptom_delete_confirmation").hide();
     $('#symptom_table_parent_div').removeClass('disabledbutton')
     $("#symptom_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_symptom()
{

    id= $("#symptom_delete_yes_btn_id").attr("data-id");
    disable_symptom_delete_confirmation();
    $.ajax({
        url:$("#symptom_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_symptom_notification("One data deleted successfully!",1)

                    $('#symptom_table').DataTable().ajax.reload();
                }
                else
                {
                    show_symptom_notification(data,2);
                }
     });
}
function show_symptom_notification(data,type)
{
     $("#symptom_notification").css('opacity' ,'0.7');

    $("#symptom_notification").show();
    $("#symptom_notification_message").html(data);
    if(type==1) {
        $("#symptom_notification").removeClass("alert-danger");
        $("#symptom_notification").addClass("alert-success");

    }
    else{
        $("#symptom_notification").removeClass("alert-success");
        $("#symptom_notification").addClass("alert-danger");
    }

    setTimeout("hide_symptom_notification()",8000);
    $("#symptom_notification").fadeTo(1000, 1,function(){$("#symptom_notification").fadeTo(7000, 0.0);});

}
function hide_symptom_notification()
{
    $("#symptom_notification").hide();
    $("#symptom_notification_message").html("");
    $('#symptom_table_parent_div').removeClass('disabledbutton')
}

function diplay_symptom_update_form(id,category,name)
{
    $("#symptom_update_popup").show();
    $('#symptom_table_parent_div').addClass('disabledbutton')
    $("#symptom_name_update").val(name);
    $("#symptom_id_update").val(id);
    load_symptom_category_to_symptom_registration_form(category);
}

function hide_symptom_update_popup()
{
    $("#symptom_name_update").val("");
    $("#symptom_id_update").val("");
    $("#symptom_update_popup").hide();
    $('#symptom_table_parent_div').removeClass('disabledbutton')
}



$('#symptom_update_form').submit(function(event) {
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
                    hide_symptom_update_popup();
                    show_symptom_notification("One data updated successfully!",1);
                    $('#symptom_update_form')[0].reset();
                     startSymptom();
                }
                else if(data.code==1)
                {
                    $("#symptom_update_name_error").html(data.message);
                    $("#symptom_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_update_name_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==2)
                {
                    $("#symptom_update_category_error").html(data.message);
                    $("#symptom_update_category_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_update_category_error").removeClass("d-block");
                    },5000);
                }
                else if(data.code==3)
                {
                    $("#symptom_update_general_error").html(data.message);
                    $("#symptom_update_general_error").addClass("d-block");
                    setTimeout(function(){
                        $("#symptom_update_general_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function load_symptom_category_to_symptom_registration_form(id)
{
    var data={'csrfmiddlewaretoken':csrf_token};
    if(id)
    {
        var data={'csrfmiddlewaretoken':csrf_token,id:id};
    }
    url=$("#symptom_registration_category_dropdown").attr("data-url");
     $.ajax({
        url:url,
         type:"post",
        data:data,
        dataType:"text",
        success:function(data)
        {
            if(id)
            {
                $("#symptom_update_category_dropdown").html(data);
                document.getElementById("symptom_update_category_dropdown").fstdropdown.rebind();
            }
            else
            {
                 $("#symptom_registration_category_dropdown").html(data);
                 document.getElementById("symptom_registration_category_dropdown").fstdropdown.rebind();
            }

        }
    });
}
load_symptom_category_to_symptom_registration_form();