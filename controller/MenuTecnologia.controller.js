sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/m/MessageToast",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";


    return BaseController.extend("sap.ui.entelantenas.controller.MenuTecnologia", {
        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("menuTecnologia").attachMatched(function(oEvent){
                thes.getcheckSession();
            }, this);
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
        goTo: function(oEvent, index){
            var oRouter = this.getOwnerComponent().getRouter();
            switch(index){
                case 1:
                    oRouter.navTo("nuevoTecnologia");
                    break;
                case 2:
                    oRouter.navTo("listarTecnologia");                   
                    break;
                default:
                    oRouter.navTo("home");                
                    break;
            }
        },        
        onPressBack: function(oEvent) {
            this.goTo(oEvent, 100);
        },
        onPressNuevoTecnologia: function(oEvent) {
            this.goTo(oEvent, 1);
        },
        onPressListarTecnologia: function(oEvent) {
            this.goTo(oEvent, 2);
        }        
    });
});