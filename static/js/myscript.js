 // function to delete table row
    function del(event){
      var Id = event.data.param.replace("btn-del-","");
      $.ajax({
        url: "delete/"+Id,
        type: "GET",
        success: function(){
          $("#tr-"+Id).remove();
          var alert = '<div class="alert alert-success" id ="success-alert">\
                  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                  Data Deleted Successfully</div>'
                $(".container").prepend(alert);

                // Smooth closing of alert ( copied from http://stackoverflow.com/questions/23101966/bootstrap-alert-auto-close )
                $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                  $("#success-alert").alert('close');
                });
          console.log("Success");
          
        },
        error: function(){
          console.log("Error!!!");
        }
      })
    }
    
    // function to add input to table cell i.e inside td
    function addInput(event){

       var Id = event.data.param.replace("btn-edit-","");
       var trId =  "#tr-"+ Id;
      
       $(trId + " td").each(function(){

        if($(this).attr("class")=="button"){
          
            var $save = '<button type="submit" class="btn btn-info" id="save-'+Id+'">Save</button>'
            $(this).html($save); 
        }
        else if($(this).attr("class") != "id"){
          var $input = '<input type="text" class="form-control" name="'+$(this).attr("class")+'" value="'+ $(this).text() +'"'+'/>'
           $(this).html($input);
        }

       })

    // listen for save button click event and call post function
       $(trId+" td button[type=submit]")
             .on("click",{param: Id},post);
    }

    // function to remove input tag and put only value inside the td tag
    function removeInput(Id){
      var trId = '#tr-' + Id;
      $(trId+" td").each(function(){
          if($(this).attr("class")!= "id" & $(this).attr("class")!= "button"){
            var $value = $(this).find("input").val();
            $(this).html($value);
          }
      })
      refreshEvent();
    }

    // function to post data to the server
    function post(event){
      var id = event.data.param.replace("save-","");
      var $firstname = $("#tr-"+ id + " " +"input[name=firstname]").val();
      var $lastname = $("#tr-"+ id + " " +"input[name=lastname]").val();
      var $address = $("#tr-"+ id + " " +"input[name=address]").val();
      var $country = $("#tr-"+ id + " " +"input[name=country]").val();
        $.ajax({
            url:'update/'+id,
            type: "POST",
            data:{firstname:$firstname,lastname:$lastname,address:$address,country:$country},
            success: function(){
                var alert = '<div class="alert alert-success" id ="success-alert">\
                  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                  Data Saved Successfully</div>'
                $(".container").prepend(alert);

                // Smooth closing of alert ( copied from http://stackoverflow.com/questions/23101966/bootstrap-alert-auto-close )
                $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                  $("#success-alert").alert('close');
                });

                // Putting back original edit and delete button
                var $button = '<button type="edit" class="btn btn-primary edit" id="btn-edit-'+id +'">Edit</button> | <button type="delete" class="btn btn-danger delete" id="btn-del-'+id+'">Delete</button></td>';
                  $("#tr-"+id+" td.button").html($button);
                  removeInput(id);
                 
            },
            error: function(e){
              var alert = '<div class="alert alert-danger" id ="error-alert">\
                  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
                  Opps! Something Wrong Happened. </div>'
                $(".container").prepend(alert);

                // Smooth closing of alert ( copied from http://stackoverflow.com/questions/23101966/bootstrap-alert-auto-close )
                $("#error-alert").fadeTo(2000, 500).slideUp(500, function(){
                  $("#error-alert").alert('close');
                });
                console.log("error");
            }
            
        })

    }

    function refreshEvent(){
      // Unbinding any previous click event associated with the buttons
      $("tr button[type=edit]").each(function(){
            $(this).unbind("click");
        });
          $("tr button[type=delete]").each(function(){
            $(this).unbind("click");
        });

      // binding click event to the buttons  
      $("tr button[type=edit]").each(function(){
            $(this).on("click",{param: this.id},addInput);
        });
          $("tr button[type=delete]").each(function(){
            $(this).on("click",{param: this.id},del);
        });  
    }
        $(document).ready(function(){
          refreshEvent();
        })