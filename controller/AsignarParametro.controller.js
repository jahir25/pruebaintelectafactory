sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    return BaseController.extend("sap.ui.entelantenas.controller.AsignarParametro", {

        onInit : function () {
        	var oView = this.getView();
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            this.getView().byId('asignarparametro').getColumns()[0].setVisible(false);
            oRouter.getRoute("asignarParametro").attachMatched(function(oEvent){
                thes.getHojaDatafill();
            }, this);
        },
        onPressBack: function(oEvent) {          
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
        getHojaDatafill: function(){
            var thes = this;
            var json = {"query": 1};
            $.ajax({
                url: 'model/getHojaDatafill.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    var resultado = JSON.parse(result);
                    /*$.each(resultado, function(i, v) {
                        if (v.estado == 1) {
                            resultado[i].ebool = true;
                        }else if(v.estado == 2){
                            resultado[i].ebool = false;
                        }
                    });*/
                    var oModel = new JSONModel(resultado);
                    thes.getView().byId('asignarparametro').setModel(oModel);
                    console.log(resultado);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        onGoAsignarParametro: function(oEvent){
            var oRouter = this.getOwnerComponent().getRouter();
            var id_hoja = btoa(oEvent.getParameter("listItem").mAggregations.cells[0].mProperties.text);
            oRouter.navTo("addParametroHoja", {'id_hoja': id_hoja});
        }
    });
});