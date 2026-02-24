import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


const Usuario = db.define("Usuario", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, // El tipo de dato es un entero sin signo, lo que significa que solo puede contener valores positivos. Esto es útil para campos como identificadores (ID) donde no se esperan valores negativos.
        primaryKey: true, // El campo id es la clave primaria de la tabla, lo que significa que cada valor en este campo debe ser único y no nulo. Esto garantiza que cada registro en la tabla pueda ser identificado de manera única.
        autoIncrement: true, // El campo id se incrementará automáticamente cada vez que se inserte un nuevo registro en la tabla. Esto facilita la generación de identificadores únicos para cada usuario sin necesidad de especificarlos manualmente.
        allowNull: false// El campo id no puede ser nulo, lo que significa que cada registro en la tabla debe tener un valor para este campo. Esto es importante para garantizar la integridad de los datos y asegurar que cada usuario tenga un identificador único.
    },

    nombre: {
        type: DataTypes.STRING (100), // El tipo de dato es una cadena de texto con una longitud máxima de 100 caracteres. Esto es adecuado para almacenar nombres de usuarios, ya que generalmente no se espera que sean extremadamente largos.
        allowNull: false, // El campo nombre no puede ser nulo o que es obligatorio 
        validate: {
            notEmpty: { // La validación notEmpty se utiliza para asegurarse de que el campo nombre no esté vacío. Esto significa que el usuario debe proporcionar un valor para este campo al registrarse o actualizar su información.
                msg: 'El nombre no puede estar vacío' // El mensaje de error que se mostrará si el campo nombre está vacío. Esto ayuda a garantizar que los usuarios proporcionen un nombre válido al registrarse o actualizar su información.
            }
        }
    },

    email : { // El campo email es una cadena de texto con una longitud máxima de 100 caracteres. Esto es adecuado para almacenar direcciones de correo electrónico, ya que generalmente no se espera que sean extremadamente largas.
        type: DataTypes.STRING (100),
        allowNull: false,
        unique: {
           msg: 'El email ya está registrado'
        },
        validate: {
            isEmail: { // La validación isEmail se utiliza para asegurarse de que el valor proporcionado en el campo email sea una dirección de correo electrónico válida. Esto ayuda a garantizar que los usuarios proporcionen un correo electrónico correcto al registrarse o actualizar su información.
                msg: 'Debe proporcionar un email válido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacío'
            }
        }
    },
    password: { // El campo password es una cadena de texto con una longitud máxima de 100 caracteres. Esto es adecuado para almacenar contraseñas, ya que generalmente no se espera que sean extremadamente largas. Sin embargo, es importante tener en cuenta que las contraseñas deben ser almacenadas de manera segura utilizando técnicas de hashing y salting para proteger la información del usuario.
        type: DataTypes.STRING (100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
            len: {
                args: [8, 100], // La validación len se utiliza para asegurarse de que la contraseña tenga una longitud mínima de 6 caracteres y una longitud máxima de 100 caracteres. Esto ayuda a garantizar que los usuarios proporcionen contraseñas seguras y adecuadas al registrarse o actualizar su información.
                msg: 'La contraseña debe tener al menos 8 caracteres'
            }
        }
    },
    confirmado: { // El campo confirmado es un booleano que indica si el usuario ha confirmado su cuenta a través de un proceso de verificación, como hacer clic en un enlace enviado por correo electrónico. Esto es útil para asegurarse de que los usuarios hayan verificado su identidad antes de permitirles acceder a ciertas funcionalidades o áreas de la aplicación.
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "confirmado"
    },
    tokenRecuperacion: { // El campo tokenRecuperacion es una cadena de texto con una longitud máxima de 255 caracteres. Este campo se utiliza para almacenar un token de recuperación que se genera cuando un usuario solicita restablecer su contraseña. El token se envía al correo electrónico del usuario y se utiliza para verificar su identidad antes de permitirle restablecer su contraseña. Es importante asegurarse de que este token sea único y seguro para proteger la información del usuario.
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "token_recuperacion"
    },
    tokenExpiracion: { // El campo tokenExpiracion es de tipo fecha y se utiliza para almacenar la fecha y hora en que expira el token de recuperación. Esto es importante para garantizar que los tokens de recuperación no sean válidos indefinidamente, lo que ayuda a mejorar la seguridad de la aplicación. Al establecer una fecha de expiración para los tokens, se reduce el riesgo de que un token comprometido pueda ser utilizado para acceder a la cuenta del usuario después de un período de tiempo razonable.
        type: DataTypes.DATE,
        allowNull: true,
        field: "token_expiracion"
    },
    regStatus: { // El campo regStatus es un booleano que indica el estado de registro del usuario. Este campo se utiliza para determinar si un usuario está activo o inactivo en la aplicación. Un valor de true generalmente indica que el usuario está activo y puede acceder a la aplicación, mientras que un valor de false indica que el usuario está inactivo y no puede acceder a la aplicación. Esto es útil para gestionar el acceso de los usuarios y controlar quién puede utilizar la aplicación en función de su estado de registro.
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "reg_status"
    },
    ultimoAcceso: { // El campo ultimoAcceso es de tipo fecha y se utiliza para almacenar la fecha y hora del último acceso del usuario a la aplicación. Esto es útil para realizar un seguimiento de la actividad de los usuarios y puede ser utilizado para implementar funcionalidades como mostrar la última vez que un usuario estuvo activo o para detectar patrones de uso inusuales. Al registrar el último acceso, también se puede mejorar la seguridad de la aplicación al identificar posibles intentos de acceso no autorizados o inactivos.
        type: DataTypes.DATE,
        allowNull: true,
        field: "ultimo_acceso"
    }
}, {
    tableName: 'tb_usuarios', // La opción tableName se utiliza para especificar el nombre de la tabla en la base de datos que se asociará con el modelo Usuario. En este caso, la tabla se llamará "tb_usuarios". Esto es útil para mantener una convención de nombres clara y consistente en la base de datos, especialmente si se tienen múltiples modelos que representan diferentes tablas. Al definir explícitamente el nombre de la tabla, se evita que Sequelize genere automáticamente un nombre basado en el nombre del modelo, lo que puede ser útil para mantener un control total sobre la estructura de la base de datos.
    timestamps: true, // La opción timestamps se establece en true para que Sequelize agregue automáticamente los campos createdAt y updatedAt a la tabla Usuario. Estos campos se utilizan para rastrear cuándo se creó y actualizó cada registro en la tabla, lo que puede ser útil para fines de auditoría y seguimiento de cambios.
    underscored: true, // La opción underscored se establece en true para que Sequelize utilice guiones bajos en lugar de camelCase para los nombres de los campos en la base de datos. Esto significa que, por ejemplo, el campo createdAt se almacenará como created_at en la base de datos. Esta convención de nombres puede ser preferida por algunos desarrolladores y puede ayudar a mantener una consistencia en la nomenclatura de los campos en la base de datos.
    createdAt: 'created_at', // La opción createdAt se utiliza para especificar el nombre del campo que Sequelize utilizará para almacenar la fecha y hora de creación de cada registro en la tabla Usuario. En este caso, el campo se llamará "created_at". Esto es útil para mantener una convención de nombres clara y consistente en la base de datos, especialmente si se tienen múltiples modelos que representan diferentes tablas. Al definir explícitamente el nombre del campo, se evita que Sequelize genere automáticamente un nombre basado en el nombre del modelo, lo que puede ser útil para mantener un control total sobre la estructura de la base de datos.
    updatedAt: 'updated_at', //

    hooks: {
        beforeCreate: async (usuario) => { // El hook beforeCreate se ejecuta antes de que se cree un nuevo registro en la tabla Usuario. En este caso, se utiliza para realizar acciones adicionales antes de guardar el nuevo usuario en la base de datos, como por ejemplo, cifrar la contraseña del usuario antes de almacenarla. Esto ayuda a mejorar la seguridad de la aplicación al asegurarse de que las contraseñas se almacenen de manera segura utilizando técnicas de hashing y salting.
            if (usuario.password) { // Verificamos si el campo password tiene un valor antes de intentar cifrarlo. Esto es importante para evitar errores en caso de que el campo password esté vacío o nulo.
                const salt = await bcrypt.genSaltSync(parseInt(process.env.BYCRYPT_RPUNDS) || 10 ); // Generamos un salt utilizando bcrypt con un factor de costo de 10. El salt es un valor aleatorio que se utiliza para mejorar la seguridad del hashing de contraseñas al agregar una capa adicional de complejidad.
                usuario.password = await bcrypt.hash(usuario.password, salt); // Ciframos la contraseña del usuario utilizando bcrypt y el salt generado. Esto asegura que la contraseña se almacene de manera segura en la base de datos, protegiendo la información del usuario en caso de que la base de datos sea comprometida.
            }
        },

        // hash de contraseña antes de actualizar el usuario (si cambió)
        beforeUpdate: async (usuario) => { // El hook beforeUpdate se ejecuta antes de que se actualice un registro existente en la tabla Usuario. En este caso, se utiliza para realizar acciones adicionales antes de guardar los cambios en la base de datos, como por ejemplo, cifrar la contraseña del usuario si ha sido modificada. Esto ayuda a mejorar la seguridad de la aplicación al asegurarse de que las contraseñas se almacenen de manera segura utilizando técnicas de hashing y salting, incluso cuando los usuarios actualizan su información.
            if (usuario.changed('password')) { // Verificamos si el campo password ha sido modificado antes de intentar cifrarlo. Esto es importante para evitar cifrar la contraseña nuevamente si no ha sido cambiada, lo que podría resultar en un hash incorrecto.
                const salt = await bcrypt.genSaltSync(parseInt(process.env.BYCRYPT_RPUNDS) || 10 ); // Generamos un salt utilizando bcrypt con un factor de costo de 10. El salt es un valor aleatorio que se utiliza para mejorar la seguridad del hashing de contraseñas al agregar una capa adicional de complejidad.
                usuario.password = await bcrypt.hash(usuario.password, salt); // Ciframos la contraseña del usuario utilizando bcrypt y el salt generado. Esto asegura que la contraseña se almacene de manera segura en la base de datos, protegiendo la información del usuario en caso de que la base de datos sea comprometida.
            }
        }
    }
}); // La opción updatedAt se utiliza para especificar el nombre del campo que Sequelize utilizará para almacenar la fecha y hora de actualización de cada registro en la tabla Usuario. En este caso, el campo se llamará "updated_at". Esto es útil para mantener una convención de nombres clara y consistente en la base de datos, especialmente si se tienen múltiples modelos que representan diferentes tablas. Al definir explícitamente el nombre del campo, se evita que Sequelize genere automáticamente un nombre basado en el nombre del modelo, lo que puede ser útil para mantener un control total sobre la estructura de la base de datos.

export default Usuario; // Exportamos el modelo Usuario para que pueda ser utilizado en otras partes de la aplicación, como en los controladores para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los registros de usuarios en la base de datos.


// {
//     timestamps: true // La opción timestamps se establece en true para que Sequelize agregue automáticamente los campos createdAt y updatedAt a la tabla Usuario. Estos campos se utilizan para rastrear cuándo se creó y actualizó cada registro en la tabla, lo que puede ser útil para fines de auditoría y seguimiento de cambios.
// });