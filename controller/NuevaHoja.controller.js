sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.NuevaHoja", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevaHoja").attachMatched(function(oEvent){
                thes.getcheckSession();
                thes.getView().byId("descripcion").setValue("");
                thes.getView().byId("nexcel").setValue("");
                thes.getView().byId("nu2000").setValue("");
            }, this);
        },
        onPressBack: function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuHoja");
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
        onPressAcepts:function(){
            if (this.getView().byId("descripcion").getValue() == '' || this.getView().byId("nexcel").getValue() == '' || this.getView().byId("nu2000").getValue() == '') {
                sap.m.MessageBox.warning("Verifique que los datos sean correctos");
            }else{
                var thes = this;
                var oRouter = this.getOwnerComponent().getRouter();

                var Parameters = {
                    'descripcion' : this.getView().byId("descripcion").getValue(),
                    'nexcel' : this.getView().byId("nexcel").getValue(),
                    'nu2000' : this.getView().byId("nu2000").getValue()
                };

                $.ajax({
                    url: 'model/nuevoHoja.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: Parameters,
                    success: function(result, status, xhr){
                        if (JSON.parse(result).warning == 'true') {
                            sap.m.MessageBox.warning(JSON.parse(result).msg);
                        }else{
                            thes.getView().byId("descripcion").setValue("");
                            thes.getView().byId("nexcel").setValue("");
                            thes.getView().byId("nu2000").setValue("");
                            oRouter.navTo("menuHoja");
                            sap.m.MessageBox.success(JSON.parse(result).success);
                        }
                        
                    },
                    error: function(xhr, status, error){
                        MessageBox.error("Error de Conexion");
                    },
                    complete: function(){
                        
                    } 
                });

            }                
        }
    });
});