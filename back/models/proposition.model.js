const mongoose=require("mongoose");

const propositionSchema=new mongoose.Schema({

    description:String,
    email:String,
    phoneNumber:String,
    prix:String,
    dateFinale: {type: Date},
    competence:Object,
    user_id:{
        type : mongoose.Types.ObjectId,
        ref:'users',
        require:true,
    },
    offer_id:{
        type : mongoose.Types.ObjectId,
        ref:'offers',
        require:true,
    },
    status:{
        type: String,
        enum:[
            'encours',
            'Qualifié',
            'confirmé',
            'refusé',
        ],
        default:'encours'
    }

}
)
module.exports=mongoose.model('propositions', propositionSchema);