# csvViewer

Big inventory - POC

### Requirements 

Using the attached sample csv file containing ~190k records, create a web application which, using IndexedDB or other client-side only affordances, enables searching for records in the following manner:

BARCODE_GTIN, PROD_CD, and CATALOG fields are to be searchable as exact matches to the entire field and as matches to either the beginning or end of the field. Returning all matching results.

PROD_DESCN_TXT field is to be full-text searchable; returning the top 20 results.

Other fields are for display only.

PERFORMANCE REQUIREMENT: Searches shall take no longer than 100ms from the time the user initiates the search to the time the first 5 results are displayed.

Searches on this data must be possible completely within the browser, with no access to the internet/origin. The performance (speed) of these searches is our primary concern. We will be testing using the latest version of Chrome, compatibility with other modern browsers is a plus, but not a requirement.

The choice of tools, language(s), framework(s), libraries, etc. is up to you; however, NO server-side components should be required by this app. That is, it should be possible to simply open the index.html file from a network share and (upon completion of page loading) disconnect the network and continue to search the data.

Open source components are encouraged, provided that they not be licensed under any license with "copyleft" provisions (i.e. we want business friendly licenses). I you plan on using commercially licenced components, please detail that in your proposal.

UI/Design: This is a function prototype (proof-of-concept) only; there are no UI requirements except those implicit in the function requirements.
