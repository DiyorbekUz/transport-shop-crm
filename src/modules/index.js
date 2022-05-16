import { makeExecutableSchema } from '@graphql-tools/schema'

import TypeModule from './types/index.js'
import StaffModule from './staff/index.js'
import BranchModule from './branch/index.js'
import TransportModule from './transport/index.js'
import TransportPermissionModule from './permission/transportPer/index.js'
import StaffPermissionModule from './permission/staffPer/index.js'

export default makeExecutableSchema({
    typeDefs: [
        StaffModule.typeDefs,
        TypeModule.typeDefs,
        BranchModule.typeDefs,
        TransportModule.typeDefs,
        TransportPermissionModule.typeDefs,
        StaffPermissionModule.typeDefs,
    ],
    resolvers: [
        StaffModule.resolvers,
        TypeModule.resolvers,
        BranchModule.resolvers,
        TransportModule.resolvers,
        TransportPermissionModule.resolvers,
        StaffPermissionModule.resolvers,
    ],
})