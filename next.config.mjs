import {withPayload} from '@payloadcms/next/withPayload'
const nextConfig={
  reactStrictMode:true,
  distDir:process.env.NEXT_BUILD_DIR||'.next',
  output:'standalone',
  poweredByHeader:false,
  experimental:{cpus:2,webpackBuildWorker:true},
  outputFileTracingIncludes:{'/*':['./node_modules/@libsql/*/**/*']},
  outputFileTracingExcludes:{'/*':['./.local/**/*','./*.db','./*.db-*','./docs/**/*','./reference/**/*','./tests/**/*','./.agents/**/*','./.env*']},
  images:{remotePatterns:[{protocol:'https',hostname:'lh3.googleusercontent.com'}],minimumCacheTTL:3600},
  async headers(){return [{source:'/images/:path*',headers:[{key:'Cache-Control',value:'public, max-age=3600'}]}]},
}
export default withPayload(nextConfig)
