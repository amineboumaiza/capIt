const mongoose=require("mongoose");

const offreSchema=new mongoose.Schema({

    titre:String,
    description:String,
    prix:String,
    dateDebut:Date,
    dateFin:Date,
    technologie:Object,
    dateCreation: {type: Date, default:Date.now()},
    creator:{
        type : mongoose.Types.ObjectId,
        ref:'users',
        require:true

    },
    isActive: {type: Boolean, default:true}

}
)
module.exports=mongoose.model('offres', offreSchema);