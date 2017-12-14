sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.NuevoTecnologia", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevoTecnologia").attachMatched(function(oEvent){
                thes.onClear();
                thes.getcheckSession();
            }, this);
        },
        onPressBack: function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuTecnologia");
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
        onClear: function(){
            var thes = this;
            thes.getView().byId("tecnologia").setValue("");
        },
        onPressAcepts:function(){
            if (this.getView().byId("tecnologia").getValue() == '' || this.getView().byId("tecnologia").getValue() == null) {
                sap.m.MessageBox.warning("Verifique que los datos sean correctos");
            }else{
                var thes = this;
                var oRouter = this.getOwnerComponent().getRouter();

                var Parameters = {
                    'nombre_tecnologia' : this.getView().byId("tecnologia").getValue(),
                };

                $.ajax({
                    url: 'model/nuevoTecnologia.php',
                    cache: false,
                    timeout: 5000,
                    type: "POST",
                    data: Parameters,
                    success: function(result, status, xhr){
                        var result = JSON.parse(result);
                        if (result.alert == true) {
                            sap.m.MessageBox.warning(result.warning); 
                       }else{
                            thes.getView().byId("tecnologia").setValue("");
                            oRouter.navTo("menuTecnologia");
                            sap.m.MessageBox.success(result.success);
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