import { User } from "src/models/user.model";
import { Post } from "src/models/post.model";

export function relations() {
    User.hasMany(Post, { foreignKey: "user_id" });
    Post.belongsTo(User, { foreignKey: "user_id" });
}