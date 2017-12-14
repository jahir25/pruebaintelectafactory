sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var id_hoja;
    return BaseController.extend("sap.ui.entelantenas.controller.EditarHoja", {

        onInit : function () {
        	var oView = this.getView();
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarHoja").attachMatched(function(oEvent){
                id_hoja = atob(oEvent.getParameter("arguments").id_hoja);
                thes.getcheckSession();
                thes.getHojaByID(id_hoja);
            }, this);
        },
        onPressBack: function(oEvent) {          
            /*var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuHoja");*/
            window.history.back();
        },
        OnPressLogout: function(){            
            var oRouter = this.getOwnerComponent().getRouter();
            $.ajax({
                url: 'model/logout.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    oRouter.navTo("login");
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){   
                } 
            });
        },
        getcheckSession: function(){
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            $.ajax({
                url: 'model/checkSession.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                success: function(result, status, xhr){
                    if (JSON.parse(result).acceso == "false") {
                        oRouter.navTo("login");
                    }
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){  
                } 
            });
        },
        getHojaByID : function(data){
            var thes = this;
            var oView = this.getView();

            var Parameters = {
                'data' : data
            };

            $.ajax({
                url: 'model/getHojaByID.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                data: Parameters,
                success: function(result, status, xhr){
                    var result = JSON.parse(result);
                    thes.getView().byId("descripcion").setValue(result.descripcion);
                    thes.getView().byId("nexcel").setValue(result.nombre_excel);
                    thes.getView().byId("nu2000").setValue(result.nombre_u2000);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                }
            });
        },
        onPressAcepts: function(){

            if (this.getView().byId("descripcion").getValue() == '' || this.getView().byId("nexcel").getValue() == '' || this.getView().byId("nu2000").getValue() == '') {
                sap.m.MessageBox.warning("Verifique que los datos sean correctos");
            }else{
                var thes = this;
                var oRouter = this.getOwnerComponent().getRouter();

                var Parameters = {
                    'descripcion' : this.getView().byId("descripcion").getValue(),
                    'nexcel' : this.getView().byId("nexcel").getValue(),
                    'nu2000' : this.getView().byId("nu2000").getValue(),
                    'id_hoja' : id_hoja
                };

                $.ajax({
                    url: 'model/ActualizarHoja.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: Parameters,
                    success: function(result, status, xhr){
                        /*oRouter.navTo("menuHoja");*/
                        sap.m.MessageBox.success('Actualizado Exitosamente');
                        window.history.back();
                    },
                    error: function(xhr, status, error){
                        sap.m.MessageBox.error("Error de Conexion");
                    },
                    complete: function(){
                        
                    } 
                });
            }
        }
    });
});