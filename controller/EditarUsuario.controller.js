sap.ui.define([
   "sap/ui/entelantenas/controller/BaseController",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
], function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";
    var that;
    var user;
    return BaseController.extend("sap.ui.entelantenas.controller.EditarUsuario", {
        onInit : function () {
            that = this;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("editarUsuario").attachMatched(function(oEvent) {
                user = oEvent.getParameter("arguments").id_usuario;                
                sap.ui.core.BusyIndicator.show(0);
                var oView = this.getView();                
                that.getcheckSession();
                that.fieldsClear();
                
                var LDAP = [
                    {id_ldap: 1, ldap: "SI"}, 
                    {id_ldap: 2, ldap: "NO"}
                ];
                var oModel = new JSONModel(LDAP);
                oView.byId('selectLDAP').setModel(oModel);
                
                var Perfil = [
                    {id_perfil: 1, perfil: "Administrador"}, 
                    {id_perfil: 2, perfil: "Cliente"}
                ];                
                var oModel = new JSONModel(Perfil);
                oView.byId('selectPerfil').setModel(oModel);
                setTimeout(function(){
                    that.getUsuario(user, 1);
                }, 1000);
                
                sap.ui.core.BusyIndicator.hide();
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
        getUsuario: function(id_usuario, action){            
            var json = {"data": id_usuario, "action": action};            
            sap.ui.core.BusyIndicator.show(0);
            $.ajax({
                url: 'model/editUsuario.php',
                cache: false,
                timeout: 5000,
                type: "POST",
                data: JSON.stringify(json),
                success: function(result, status, xhr){
                    result = JSON.parse(result)[0];
                    
                    /*that.getView().byId("id_usuario").setValue(result.id_usuario);*/
                    that.getView().byId("login").setValue(result.login);
                    that.getView().byId("selectLDAP").setSelectedKey(result.id_ldap);
                    that.getView().byId("nombre").setValue(result.nombres);
                    that.getView().byId("apellido").setValue(result.apellidos);
                    /*that.getView().byId("pass").setValue(result.password);*/
                    that.getView().byId("selectPerfil").setSelectedKey(result.id_perfil);
                    that.getView().byId("email").setValue(result.email);
                    if(parseInt(result.id_ldap) == 2){
                        result.password = window.atob(result.password);                        
                        that.getView().byId("pass").setValue(result.password);                        
                        that.getView().byId("elementpass").setVisible(true);
                    }else{                                                
                        that.getView().byId("elementpass").setVisible(false);
                    }
                    sap.ui.core.BusyIndicator.hide();
                    /*oRouter.navTo("menuUsuario");*/
                },
                error: function(xhr, status, error){
                    MessageBox.error("Error de Conexion");
                },
                complete: function(){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        onPressBack: function(oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("listarUsuario");
        },
        onChangeLDAP: function(oEvent){
            var val =  this.getView().byId("selectLDAP").getSelectedKey(); 

            if (val == 1) {
                this.getView().byId("elementpass").setVisible(false);
            }else if(val == 2){
                this.getView().byId("elementpass").setVisible(true);
            }
        },
        onPressSave:function(){
            var oRouter = that.getOwnerComponent().getRouter();            
            var log = that.getView().byId("login").getValue();
            var nom = that.getView().byId("nombre").getValue();
            var ape = that.getView().byId("apellido").getValue();
            var contra = that.getView().byId("pass").getValue();
            var email = that.getView().byId("email").getValue();
            var LDAP =  that.getView().byId("selectLDAP").getSelectedKey(); 
            var findSuccess = 0;
            var regex=/^[a-zA-Z ]+$/;
            var regex2=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            sap.ui.core.BusyIndicator.show(0);
            
            if(!log){
                findSuccess -1;
                MessageBox.error("Ingrese un valor correcto en el campo login");
            }
            if(!nom.match(regex)){
                MessageBox.error("Ingrese un valor correcto en el campo nombre");
                findSuccess -1;
            }
            if(!ape.match(regex)){
                findSuccess -1;
                MessageBox.error("Ingrese un valor correcto en el campo apellido");
            }
            if(contra.length<8 && LDAP==2 ){//LDAP==" es para que solo cuando este visible el campo pass valide
                findSuccess -1;
                MessageBox.error("El valor de la contraseña debe ser mayor a 8 dígitos");
            }
            if(!email.match(regex2)){
                findSuccess -1;
                MessageBox.error("Ingrese un valor correcto en el campo email");  
            }
                               
            var Parameters = {
            "data": {
                "id_usuario": user,
                "login" : log,                                        
                "LDAP" : LDAP,
                "nombre" : nom,
                "apellido" : ape,
                "password" : contra,
                "perfil" : that.getView().byId("selectPerfil").getSelectedKey(),
                "email" : that.getView().byId("email").getValue()
            },
            "action": 2
            };
            console.log(findSuccess);
            if(findSuccess ==0){
                $.ajax({
                    url: 'model/editUsuario.php',
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
                                    oRouter.navTo("listarUsuario");
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
                        sap.ui.core.BusyIndicator.hide();
                    } 
                });
            }else{
                sap.ui.core.BusyIndicator.hide();
            }
        },
        fieldsClear: function(){
            that.getView().byId("login").setValue("");
            that.getView().byId("selectLDAP").setSelectedKey(0);
            that.getView().byId("nombre").setValue("");
            that.getView().byId("apellido").setValue("");
            that.getView().byId("pass").setValue("");
            that.getView().byId("selectPerfil").setSelectedKey(0);
            that.getView().byId("email").setValue("");
        }
    });
});