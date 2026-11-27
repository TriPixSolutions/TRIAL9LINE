<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9" exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8"/>
  <xsl:template match="/">
    <html lang="en"><head><title>Sitemap | Trail9ine Media</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>body{max-width:54rem;margin:8vh auto;padding:0 1.5rem;color:#211d24;font:1rem/1.65 system-ui}li{padding:.5rem 0;border-bottom:1px solid #ddd;overflow-wrap:anywhere}a{color:#493253}ul{list-style:none;padding:0}</style>
    </head><body><main><a href="/sitemap">Browse the site directory</a>
      <h1><xsl:choose><xsl:when test="s:sitemapindex">Sitemap index</xsl:when><xsl:otherwise>Sitemap URLs</xsl:otherwise></xsl:choose></h1>
      <ul><xsl:for-each select="/*/*/s:loc"><li><a href="{.}"><xsl:value-of select="."/></a></li></xsl:for-each></ul>
    </main></body></html>
  </xsl:template>
</xsl:stylesheet>
