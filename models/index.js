import Blog from './blog.js'
import User from './user.js'
import ReadingList from "./reading-list.js";

User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })
User.hasMany(ReadingList)
ReadingList.belongsTo(User)
ReadingList.belongsTo(Blog)


export { Blog, User, ReadingList }