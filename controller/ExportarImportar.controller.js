/*jQuery.sap.require("sap.ui.entelantenas.util.dist.xlsx.full.min");*/
sap.ui.define([
    "sap/ui/entelantenas/controller/BaseController",    
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, MessageToast, MessageBox) {
    "use strict";
    var url;
    var jsondata = [];
    return BaseController.extend("sap.ui.entelantenas.controller.ExportarImportar", {
        onInit : function (oEvent) {
            var thes = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("homeUser").attachMatched(function(oEvent){
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
        onChange : function(oEvent) {
            this._import(oEvent.getParameter("files") && oEvent.getParameter("files")[0]);            
        },
         _import : function(file) {
             if(file && window.FileReader){
                var reader = new FileReader();
                var result = {}, data;
                reader.onload = function(e) {
                    data = e.target.result;
                    var wb = XLSX.read(data, {type: 'binary'});
                    console.log(wb);
                    wb.SheetNames.forEach(function(sheetName) {
                        var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                        var jsonvar = {
                            'hoja': sheetName,
                            'header': Object.keys(roa[0]),
                            'data': roa
                        }
                        jsondata.push(jsonvar);
                    });
                    return result;
                }
            reader.readAsBinaryString(file);
            }
        },
        handleUploadPress : function(){
            var thes = this;

            $.ajax({
                url: 'model/demoImport.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                async: false,
                data: JSON.stringify(jsondata),
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
        }
    });
});