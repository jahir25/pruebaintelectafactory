sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
], function (BaseController, JSONModel, MessageToast, Table) {
    "use strict";
    var id_hoja;
    return BaseController.extend("sap.ui.entelantenas.controller.AddParametroHoja", {

        onInit : function () {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            // this.getView().byId('addParametroHoja').getColumns()[0].setVisible(false);
            oRouter.getRoute("addParametroHoja").attachMatched(function(oEvent){
                id_hoja = atob(oEvent.getParameter("arguments").id_hoja);
                thes.getParametrosSinAsignar(id_hoja);
                thes.getParametrosAsignados(id_hoja);
                thes.getcheckSession();
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
        getParametrosSinAsignar: function(data){
            var thes = this;

            var Parameters = {
                'data' : data,
            };

            $.ajax({
                url: 'model/getParametrosSinAsignar.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: Parameters,
                success: function(result, status, xhr){
                    var resultado = JSON.parse(result);
                    var oModel = new JSONModel(resultado);
                    thes.getView().byId('addParametro').setModel(oModel);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        getParametrosAsignados: function(data){
            var thes = this;

            var Parameters = {
                'data' : data,
            };

            $.ajax({
                url: 'model/getParametrosAsignados.php',
                cache: false,
                timeout: 5000,
                type: "GET",
                data: Parameters,
                success: function(result, status, xhr){
                    var resultado = JSON.parse(result);
                    var oModel = new JSONModel(resultado);
                    thes.getView().byId('parametrosasignados').setModel(oModel);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        OnAsignarParametro: function(oEvent){
            var thes = this;
            var arrayitem = [];
            var items = thes.getView().byId("addParametro").getSelectedItems();            
            $.each(items, function(idx, item){
                arrayitem.push({"id_parametro": item.mAggregations.cells[0].mProperties.text});
            });

            var Parameters = {
                'id_hoja': id_hoja,
                'data': arrayitem
            };

            $.ajax({
                url: 'model/AsignarParametroXHoja.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: Parameters,
                success: function(result, status, xhr){
                    thes.getParametrosSinAsignar(id_hoja);
                    thes.getParametrosAsignados(id_hoja);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        },
        OnDessignarParametro: function(oEvent){
            var thes = this;
            var arrayitem = [];
            var items = thes.getView().byId("parametrosasignados").getSelectedItems();            
            $.each(items, function(idx, item){
                arrayitem.push({"id_parametro": item.mAggregations.cells[0].mProperties.text});
            });

            var Parameters = {
                'id_hoja': id_hoja,
                'data': arrayitem
            };

            $.ajax({
                url: 'model/DesignarParametroXHoja.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: Parameters,
                success: function(result, status, xhr){
                    thes.getParametrosSinAsignar(id_hoja);
                    thes.getParametrosAsignados(id_hoja);
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    
                } 
            });
        }
    });
});