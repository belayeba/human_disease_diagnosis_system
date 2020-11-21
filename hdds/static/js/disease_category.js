 $("#registering_disease_category_form_block").hide();
function toggle_diseasecategory_registration_block()
{
    $("#registering_disease_category_form_block").slideToggle();

}
function startDiseaseCategory()
{
      $('#disease_category_table').DataTable().clear().destroy();
      $('#disease_category_table').dataTable({
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

                    return '<a href="#" onclick=\'diplay_disease_category_update_form('+row[1]+',"'+row[0]+'");\'>edit</a>'; }
            },
            {
                mData: null,
                orderable: false,
                searchable: false,
                bSortable: false,
                targets: [2],
                mRender: function (data, type, row ) {
                    return '<a href="#" style="color:brown" onclick=\'delete_disease_category('+row[1]+',"'+row[0]+'");\'>delete</a>'; }
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
        ajax: $("#disease_category_table").attr("data-url")
    });
}

function load_disease_category_name(key,url)
{
    $.ajax({
        url:url,
        method:"post",
        data:{key:key,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
        success:function(data)
        {
            $('#disease_category_name_browser').html(data);
        }
    });
}

$('#disease_category_registering_form').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type        : 'POST',
            url         : $(this).attr('data-url'),
            data        : formData,
            dataType    : 'text',
            encode      : true
        })
            .done(function(data) {
                if(data=="yes")
                {
                     show_disease_category_notification("One data registered successfully!",1);
                    setTimeout(function(){
                        $("#disease_category_registration_success_alert").removeClass("d-block");
                    },5000);
                    startDiseaseCategory();
                    $('#disease_category_registering_form')[0].reset();
                    load_disease_category_to_disease_registration_form();
                }
                else
                {
                    $("#disease_category_registration_name_error").html(data);
                    $("#disease_category_registration_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_category_registration_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });

function delete_disease_category(id,name)
{
     $("#disease_category_delete_confirmation_name").html(name);
     $("#disease_category_delete_confirmation").show();
     $('#disease_category_table_parent_div').addClass('disabledbutton')
     $("#disease_category_delete_yes_btn_id").attr("data-id",id)
}
function disable_disease_category_delete_confirmation()
{
     $("#disease_category_delete_confirmation_name").html("");
     $("#disease_category_delete_confirmation").hide();
     $('#disease_category_table_parent_div').removeClass('disabledbutton')
     $("#disease_category_delete_yes_btn_id").attr("data-id","")
}
function confirmed_delete_disease_category()
{
    id= $("#disease_category_delete_yes_btn_id").attr("data-id");
    disable_disease_category_delete_confirmation();
    $.ajax({
        url:$("#disease_category_delete_yes_btn_id").attr("data-url"),
        method:"post",
        data:{id:id,'csrfmiddlewaretoken':csrf_token},
        dataType:"text",
    })

     .done(function(data)
     {
                if(data=="yes")
                {
                    show_disease_category_notification("One data deleted successfully!",1)

                    $('#disease_category_table').DataTable().ajax.reload();
                    $('#disease_table').DataTable().ajax.reload();
                    load_disease_category_to_disease_registration_form();
                }
                else
                {
                    show_disease_category_notification(data,2);
                }
     });
}
function show_disease_category_notification(data,type)
{
     $("#disease_category_notification").css('opacity' ,'0.7');

    $("#disease_category_notification").show();
    $("#disease_category_notification_message").html(data);
    if(type==1) {
        $("#disease_category_notification").removeClass("alert-danger");
        $("#disease_category_notification").addClass("alert-success");

    }
    else{
        $("#disease_category_notification").removeClass("alert-success");
        $("#disease_category_notification").addClass("alert-danger");
    }

    setTimeout("hide_disease_category_notification()",8000);
    $("#disease_category_notification").fadeTo(1000, 1,function(){$("#disease_category_notification").fadeTo(7000, 0.0);});

}
function hide_disease_category_notification()
{
    $("#disease_category_notification").hide();
    $("#disease_category_notification_message").html("");
    $('#disease_category_table_parent_div').removeClass('disabledbutton')
}

function diplay_disease_category_update_form(id,name)
{
    $("#disease_category_update_popup").show();
    $('#disease_category_table_parent_div').addClass('disabledbutton')
    $("#disease_category_name_update").val(name);
    $("#disease_category_id_update").val(id);
}

function hide_disease_category_update_popup()
{
    $("#disease_category_name_update").val("");
    $("#disease_category_id_update").val("");
    $("#disease_category_update_popup").hide();
    $('#disease_category_table_parent_div').removeClass('disabledbutton')
}



$('#disease_category_update_form').submit(function(event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type        : 'POST',
            url         : $(this).attr('data-url'),
            data        : formData,
            dataType    : 'text',
            encode      : true
        })
            .done(function(data) {
                if(data=="yes")
                {
                     hide_disease_category_update_popup();
                     show_disease_category_notification("One data updated successfully!",1);
                      $('#disease_category_table').DataTable().ajax.reload();
                      load_disease_category_to_disease_registration_form();
                }
                else
                {
                    $("#disease_category_update_name_error").html(data);
                    $("#disease_category_update_name_error").addClass("d-block");
                    setTimeout(function(){
                        $("#disease_category_update_name_error").removeClass("d-block");
                    },5000);
                }

            });

    });
