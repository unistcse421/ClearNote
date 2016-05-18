var mongoose = require('mongoose');

//function MyCtrl($scope){
//    $scope.$watch('dy_color', function(val){
//        console.log('val '+ val);
//    });
//}
var CardSchema = new mongoose.Schema({
    card_type: {type: String, default: 'announcement'},
    title: String,
    content: String,
    pub_date: { type:Date, default: Date.now },
    section: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});
    // creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},


mongoose.model('Card', CardSchema);
