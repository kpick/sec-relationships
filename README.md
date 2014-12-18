sec-relationships
=================

A neo4j proof of concept for various types of security relationships.

This is definitely a work in progress. I'm essentially developing a model that will find interesting ways to do security
analysis on a multitude of data feeds from disparate sources, leveraging the relationship between those sources. I'm hacking
together some social networking code right now, to vet out user relationships, and then going to incorpoate other sources
(machines, business domain, vulnerabilities, type of information, etc).

DONE: 
- Web UI 
- Writing live to a local neo4j instance
- Added unary relationship modifiable on the UI
- CRUD implemented for Nodes.

TO DO:
- Add selectable/customizable relationships between nodes
- Add weighting and traversal to neo4j
- Start research data connectors for import.

DEPENDENCIES:
- Node.js
	- express
		- method-override
		- body-parser
		- routes
	- jade
	- mocha
	- neo4j
	- node-neo4j
	- node-dev
- neo4j

DIRECTIONS:
- Install neo4j locally and start it up (default port 7474)
- Download the source and run 'npm start'
- It should just work. Hopefully.
