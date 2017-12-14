sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController"
], function (BaseController) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.MenuValores", {
        onInit : function () {
            this.getcheckSession();
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
        goTo: function(index){
            var oRouter = this.getOwnerComponent().getRouter();
            switch(index){
                case 1:
                    oRouter.navTo("nuevoValores");                
                    break;
                case 2:
                    oRouter.navTo("listarValores");                
                    break;
                default:
                    oRouter.navTo("home");                
                    break;
            }
        },        
        onPressBack: function() {
            this.goTo(100);
        },
        onPressNuevoValores: function() {
            this.goTo(1);
        },
        onPressListarValores: function() {
            this.goTo(2);
        }
    });
});