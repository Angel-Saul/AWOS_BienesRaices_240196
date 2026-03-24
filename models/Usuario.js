import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define("Usuario", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },

    nombre: {
        type: DataTypes.STRING(100), 
        allowNull: false, 
        validate: {
            notEmpty: { 
                msg: 'El nombre no puede estar vacío' 
            }
        }
    },

    email: { 
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
           msg: 'El email ya está registrado'
        },
        validate: {
            isEmail: { 
                msg: 'Debe proporcionar un email válido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacío'
            }
        }
    },

    password: { 
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
            len: {
                args: [8, 100], 
                msg: 'La contraseña debe tener al menos 8 caracteres'
            }
        }
    },

    confirmado: { 
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "confirmado"
    },

    token: { 
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "token_recuperacion"
    },

    tokenExpiracion: { 
        type: DataTypes.DATE,
        allowNull: true,
        field: "token_expiracion"
    },

    // --- CAMPOS DE BLOQUEO DE SEGURIDAD ---
    intentos: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
        field: "intentos_fallidos"
    },

    bloqueado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "cuenta_bloqueada"
    },
    // --------------------------------------

    regStatus: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "reg_status"
    },

    ultimoAcceso: { 
        type: DataTypes.DATE,
        allowNull: true,
        field: "ultimo_acceso"
    }
}, {
    tableName: 'tb_usuarios', 
    timestamps: true, 
    underscored: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at',

    hooks: {
        // Cifrar contraseña antes de crear el registro
        beforeCreate: async (usuario) => { 
            if (usuario.password) { 
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10); 
                usuario.password = await bcrypt.hash(usuario.password, salt); 
            }
        },

        // Cifrar contraseña antes de actualizar (si cambió)
        beforeUpdate: async (usuario) => { 
            if (usuario.changed('password')) { 
                const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10); 
                usuario.password = await bcrypt.hash(usuario.password, salt); 
            }
        }
    }
});

// ============================================================
// METODOS DE INSTANCIA
// ============================================================

// Compara la contraseña enviada en el login con la almacenada en la DB
Usuario.prototype.validarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

export default Usuario;