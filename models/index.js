import Blog from './blog.js'
import User from './user.js'
import ReadingList from "./reading-list.js";
import ActiveSession from "./active-session.js";

User.hasMany(Blog)
Blog.belongsTo(User)
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })
User.hasMany(ReadingList)
ReadingList.belongsTo(User)
ReadingList.belongsTo(Blog)
User.hasMany(ActiveSession)
ActiveSession.belongsTo(User)


export { Blog, User, ReadingList, ActiveSession }