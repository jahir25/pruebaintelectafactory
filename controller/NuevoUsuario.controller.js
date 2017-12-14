sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var cambiopass=false;
    var that;
    return BaseController.extend("sap.ui.entelantenas.controller.NuevoUsuario", {
        onInit : function () {            
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("nuevoUsuario").attachMatched(function(oEvent) {
                that.fieldsClear();
                var oView = this.getView();
                this.getView().byId("elementpass").setVisible(false); 
                this.getcheckSession();
                var LDAP = [{'codigo':1, 'nombre': 'Si'}, {'codigo':2, 'nombre': 'No'}];
                var oModel = new JSONModel({
                   "LDAPitems": LDAP
                });
                oView.byId('selectLDAP').setModel(oModel, "LDAP");
                
                var Perfil = [{'codigo':1, 'label': 'Administrador'}, {'codigo':2, 'label': 'Cliente'}];
                var oModel = new JSONModel({
                   "Perfilitems": Perfil
                });
                oView.byId('selectPerfil').setModel(oModel, "Perfil");
                
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
        onPressBack: function(oEvent) {
            // The source is the list item that got pressed        
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("menuUsuario");
        },
        onChangeLDAP: function(oEvent){
            var val =  this.getView().byId("selectLDAP").getSelectedKey(); 

            if (val == 1) {
                this.getView().byId("elementpass").setVisible(false);
            }else if(val == 2){
                this.getView().byId("elementpass").setVisible(true);
                setTimeout(function(){
                    that.getView().byId("apellido").setValue("");
                    that.getView().byId("pass").setValue("");                    
                }, 500);
            }
        },
        onPressSav:function(){
            var oRouter = this.getOwnerComponent().getRouter();            
            var log=this.getView().byId("login").getValue();
            var nom=this.getView().byId("nombre").getValue();
            var ape=this.getView().byId("apellido").getValue();
            var contra=this.getView().byId("pass").getValue();
            var email=this.getView().byId("email").getValue();
            var LDAP =  this.getView().byId("selectLDAP").getSelectedKey(); 

            var regex=/^[a-zA-Z ]+$/;
            var regex2=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            
            if(!log){
                MessageBox.error("Ingrese un valor correcto en el campo login");
            }else{
                if(!nom.match(regex)){
                 MessageBox.error("Ingrese un valor correcto en el campo nombre");   
                }else{
                    if(!ape.match(regex)){
                        MessageBox.error("Ingrese un valor correcto en el campo apellido");  
                    }else{
                        if(contra.length<8 && LDAP==2 ){//LDAP==" es para que solo cuando este visible el campo pass valide
                            MessageBox.error("El valor de la contraseña debe ser mayor a 8 dígitos");
                        }else{
                            if(!email.match(regex2)){
                                MessageBox.error("Ingrese un valor correcto en el campo email");  
                            }else{
                                
                                 var Parameters = {
                                    'login' : log,
                                    'LDAP' : LDAP,
                                    'nombre' : nom,
                                    'apellido' : ape,
                                    'pass' : contra,
                                    'perfil' : that.getView().byId("selectPerfil").getSelectedKey(),
                                    'email' : that.getView().byId("email").getValue()
                                    };
                                $.ajax({
                                    url: 'model/nuevoUsuario.php',
                                    cache: false,
                                    timeout: 5000,
                                    type: "POST",
                                    data: JSON.stringify(Parameters),
                                    success: function(result, status, xhr){
                                        result = JSON.parse(result);
                                        if(result.type == "s"){      
                                            
                                            sap.m.MessageBox.success(result.success,{
                                                actions: [sap.m.MessageBox.Action.OK],
                                                onClose: function(oAction) {
                                                    that.fieldsClear();
                                                    oRouter.navTo("menuUsuario");
                                                }
                                            });                                                     
                                        }else{
                                            sap.m.MessageBox.error(result.error);
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
                    }
                }
            }
        },
        fieldsClear: function(){
            that.getView().byId("login").setValue("");
            that.getView().byId("selectLDAP").setSelectedKey(1);
            that.getView().byId("nombre").setValue("");
            that.getView().byId("apellido").setValue("");
            that.getView().byId("pass").setValue("");
            that.getView().byId("selectPerfil").setSelectedKey(1);
            that.getView().byId("email").setValue("");
        }
    });
});