<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">

  <html><head>
     <title>Donations made to holatuwol</title>
  </head><body bgcolor="#F9F9FF">
  <blockquote>

	<p>This is the list showing everything that's been donated to further the efforts on KoLmafia that were sent to shwei (#296946) or holatuwol (#458968). They were recently taken down during the testing of KoLmafia's updated display case manager, and I'm too lazy to try to put them all back up again.  However, this list will continue to be updated and is up-to-date as of <xsl:value-of select="donation-list/@timestamp" /> and will be updated as frequently as I am able.</p>

	<ul>
	<xsl:for-each select="donation-list/donation">
	<xsl:sort select="@name" />

	<li>

		<strong><xsl:value-of select="@name" /> (#<xsl:value-of select="@pid" />)</strong>:
		<xsl:for-each select="item"><xsl:sort select="@name" /><xsl:if test="position() &gt; 1">, </xsl:if><xsl:value-of select="@name" /> (<xsl:value-of select="@quantity" />)</xsl:for-each>
		<xsl:if test="meat"><xsl:if test="item">, </xsl:if><xsl:value-of select="meat/@quantity" /> meat</xsl:if>

	</li>

	</xsl:for-each>
	</ul>

  </blockquote>
  </body></html>

</xsl:template>
</xsl:stylesheet>
