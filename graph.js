const SVG_NS = "http://www.w3.org/2000/svg";

function Graph(id) {
    this.id = id;            // (unique) ID of this graph
    this.vertices = [];      // set of vertices in this graph
    this.edges = [];         // set of edges in this graph
    this.nextVertexID = 0;   // ID to be assigned to next vtx
    this.nextEdgeID = 0;     // ID to be assigned to next edge
    
    // create a and return a new vertex at a given location
    this.createVertex = function (x, y) {
	const vtx = new Vertex(this.nextVertexID, this, x, y);
	this.nextVertexID++;
	return vtx;
    }

    // add vtx to the set of vertices of this graph, if the vtx is not
    // already stored as a vertex
    this.addVertex = function (vtx) {
	if (!this.vertices.includes(vtx)) {
	    this.vertices.push(vtx);
	    console.log("added vertex with id " + vtx.id);
	} else {
	    console.log("vertex with id " + vtx.id + " not added because it is already a vertex in the graph.");
	}
    }

    // create and return an edge between vertices vtx1 and vtx2;
    // returns existing edge if there is already an edge between the
    // two vertices
    this.addEdge = function(vtx1, vtx2) {
	if (!this.isEdge(vtx1, vtx2)) {
		const weight = prompt("Enter weightage for edge (" + vtx1.id + ", " + vtx2.id + "):");
	    const edge = new Edge(vtx1, vtx2, this.nextEdgeID, weight);
	    this.nextEdgeID++;
	    vtx1.addNeighbor(vtx2);
	    vtx2.addNeighbor(vtx1);
	    this.edges.push(edge);
	    console.log("added edge (" + vtx1.id + ", " + vtx2.id + ") with weightage " + weight);

		// Update weightage paragraph
		const weightageParagraph = document.getElementById("weightage-paragraph");
		const existingContent = weightageParagraph.innerHTML;
		const newContent = existingContent + "<br>Added edge (" + vtx1.id + ", " + vtx2.id + ") with weightage " + weight;
		weightageParagraph.innerHTML = newContent;
	    
		return edge;
	} else {
	    console.log("edge (" + vtx1.id + ", " + vtx2.id + ") not added because it is already in the graph");
	    return null;
	}
    }

    // determine if vtx1 and vtx2 are already an edge in this graph
    this.isEdge = function (vtx1, vtx2) {
	return (this.getEdge(vtx1, vtx2) != null);
    }

    // return the edge object corresponding to a pair (vtx1, vtx2), or
    // null if no such edge is in the graph
    this.getEdge = function (vtx1, vtx2) {
	for(const edge of this.edges) {
	    if (edge.equals(vtx1, vtx2)) {
		return edge;
	    }
	}

	return null;
    }

    // return a string representation of the adjacency lists of the
    // vertices in this graph
    this.adjacencyLists = function () {
		let str = '';
		for (const vtx of this.vertices) {
			str += vtx.id + ':';
			for (const nbr of vtx.neighbors) {
				str += (' ' + nbr.id);
			}
			str += '<br>';
		}
		return str;
    }
}

// an object representing a vertex in a graph
// each vertex has an associated unique identifier (id), the graph
// containing the vertex, as well as x,y coordinates of the vertex's
// physical location
function Vertex(id, graph, x, y) {
    this.id = id;        // the unique id of this vertex
    this.graph = graph;  // the graph containing this vertex
    this.x = x;          // x coordinate of location
    this.y = y;          // y coordinate of location
    
    this.neighbors = []; // the adjacency list of this vertex

    // add vtx as a neighbor of this vertex, if it is not already a
    // neighbor
    this.addNeighbor = function (vtx) {
	if (!this.neighbors.includes(vtx)) {
	    this.neighbors.push(vtx);
	}
    }

    // remove vtx as a neighbor of this vertex
    this.removeNeighbor = function (vtx) {
	const index = this.neighbors.indexOf(vtx);
	if (index != -1) {
	    this.neighbors.splice(index, 1);
	}
    }

    // determine if vtx is a neighbor of this vertex
    this.hasNeighbor = function (vtx) {
	return this.neighbors.includes(vtx);
    }

    this.degree = function () {
	return this.neighbors.length;
    }
}

// an object representing an edge in a graph
function Edge (vtx1, vtx2, id, weight) {
    this.vtx1 = vtx1;   // first endpoint of the edge
    this.vtx2 = vtx2;   // second endpoint of the edge
    this.id = id;       // the unique identifier of this edge
	this.weight = weight; // the weight of this edge

    // determine if this edge has vtx1 and vtx2 as endpoints
    this.equals = function (vtx1, vtx2) {
	return (this.vtx1 == vtx1 && this.vtx2 == vtx2) || (this.vtx1 == vtx2 && this.vtx2 == vtx1);
    }
}

// an object to visualize and interact with a graph
function GraphVisualizer (graph, svg, text) {
    this.graph = graph;      // the graph we are visualizing
    this.svg = svg;          // the svg element we are drawing on
    this.text = text;        // a text box
    
    this.currentLayout = "random"; // the current layout engine

    // define the behavior for clicking on the svg element
    this.svg.addEventListener("click", (e) => {
	// create a new vertex
	this.createVertex(e);
    });

    // sets of highlighted/muted vertices and edges
    this.highVertices = [];
    this.lowVertices = [];
    this.highEdges = [];
    this.lowEdges = [];

    // create svg group for displaying edges
    this.edgeGroup = document.createElementNS(SVG_NS, "g");
    this.edgeGroup.id = "graph-" + graph.id + "-edges";
    this.svg.appendChild(this.edgeGroup);

    // create svg group for displaying overlays
    this.overlayGroup = document.createElementNS(SVG_NS, "g");
    this.overlayGroup.id = "graph-" + graph.id + "-overlay";
    this.svg.appendChild(this.overlayGroup);


    // create svg group for displaying vertices
    this.vertexGroup = document.createElementNS(SVG_NS, "g");
    this.vertexGroup.id = "graph-" + graph.id + "-vertices";
    this.svg.appendChild(this.vertexGroup);

    // overlay vertices
    this.overlayVertices = [];


    this.addOverlayVertex = function (vtx) {
	const elt = document.createElementNS(SVG_NS, "circle");
	elt.classList.add("overlay-vertex");
	elt.setAttributeNS(null, "cx", vtx.x);
	elt.setAttributeNS(null, "cy", vtx.y);
	this.overlayGroup.appendChild(elt);
	this.overlayVertices[vtx.id] = elt;
    }

    this.moveOverlayVertex = function (vtx1, vtx2) {
	const elt = this.overlayVertices[vtx1.id];
	this.overlayVertices[vtx1.id] = null;
	this.overlayVertices[vtx2.id] = elt;
	elt.setAttributeNS(null, "cx", vtx2.x);
	elt.setAttributeNS(null, "cy", vtx2.y);
    }

    this.removeOverlayVertex = function (vtx) {
	const elt = this.overlayVertices[vtx.id];
	this.overlayGroup.removeChild(elt);	
    }

    this.vertexElts = [];   // svg elements for vertices
    this.edgeElts = [];     // svg elements for edges

    // create a new vertex 
    this.createVertex = function (e) {
		const rect = this.svg.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const vtx = graph.createVertex(x, y);
		this.addVertex(vtx);
		this.graph.addVertex(vtx);
		this.updateTextBox(graph.adjacencyLists());
    }

    // add a vertex to the visualization by creating an svg element
    this.addVertex = function (vtx) {
		const elt = document.createElementNS(SVG_NS, "circle");
		elt.classList.add("vertex");
		elt.setAttributeNS(null, "cx", vtx.x);
		elt.setAttributeNS(null, "cy", vtx.y);
		elt.setAttributeNS(null, "r", 12);
		
		//add text inside the circle
		const text = document.createElementNS(SVG_NS, "text");
		text.setAttributeNS(null, "x", vtx.x);
		text.setAttributeNS(null, "y", vtx.y);
		text.setAttributeNS(null, "text-anchor", "middle");
		text.setAttributeNS(null, "dominant-baseline", "middle");
		text.setAttributeNS(null, "font-size", "12");
		text.setAttributeNS(null, "fill", "black");
		text.setAttributeNS(null, "font-weight", "bold");
		text.textContent = vtx.id;

		elt.addEventListener("click", (e) => {
			e.stopPropagation();
			this.clickVertex(vtx);
	});

	// define behavior when hovering over the vertex
	elt.addEventListener("mouseover", (e) => {
	    this.muteAll();
	    this.unmuteVertex(vtx);
	    this.highlightVertex(vtx);
	    for (let nbr of vtx.neighbors) {
		this.highlightVertex(nbr);
		this.highlightEdge(this.graph.getEdge(vtx, nbr));
	    }
	});

	// define behavior when un-hovering
	elt.addEventListener("mouseout", (e) => {
	    this.unmuteAll();
	    this.unhighlightAll();
	});

	this.vertexGroup.appendChild(elt);
	this.vertexGroup.appendChild(text);
	this.vertexElts[vtx.id] = elt;
    }

    this.draw = function () {
	// redraw vertices, adding those not already in the visualization
	for (let vtx of this.graph.vertices) {
	    let vtxElt = this.vertexElts[vtx.id];
	    if (vtxElt === undefined) {
		this.addVertex(vtx);
	    } else {
		vtxElt.setAttributeNS(null, "cx", vtx.x);
		vtxElt.setAttributeNS(null, "cy", vtx.y);
	    }
	}

	// redraw edges, adding those not already in the visualization
	for (let edge of this.graph.edges) {
	    let edgeElt = this.edgeElts[edge.id];
	    if (edgeElt === undefined) {
		this.addEdge(edge);
	    } else {
		let vtx1 = edge.vtx1;
		let vtx2 = edge.vtx2;
		edgeElt.setAttributeNS(null, "x1", vtx1.x);
		edgeElt.setAttributeNS(null, "y1", vtx1.y);
		edgeElt.setAttributeNS(null, "x2", vtx2.x);
		edgeElt.setAttributeNS(null, "y2", vtx2.y);
	    }
	}
    }

    // method to be called when a vertex is clicked
    this.clickVertex = function (vtx) {
	// console.log("You clicked vertex " + vtx.id);

	// check if any other highlighted vertices
	if (this.highVertices.length == 0) {
	    this.highVertices.push(vtx);
	    this.highlightVertex(vtx);
	    this.addOverlayVertex(vtx);
	} else if (this.highVertices.includes(vtx)) {
	    this.unhighlightVertex(vtx);
	    this.highVertices.splice(this.highVertices.indexOf(vtx), 1);
	    this.removeOverlayVertex(vtx);
	} else {
	    const other = this.highVertices.pop();
	    let e = this.graph.addEdge(other, vtx);
	    if (e != null) {
		this.addEdge(e);
	    }
	    this.unhighlightVertex(other);
	    this.removeOverlayVertex(other);
	}
    }

    // add an edge to the visualization
    this.addEdge = function (edge) {
	const vtx1 = edge.vtx1;
	const vtx2 = edge.vtx2;
	const edgeElt = document.createElementNS(SVG_NS, "line");
	edgeElt.setAttributeNS(null, "x1", vtx1.x);
	edgeElt.setAttributeNS(null, "y1", vtx1.y);
	edgeElt.setAttributeNS(null, "x2", vtx2.x);
	edgeElt.setAttributeNS(null, "y2", vtx2.y);
	edgeElt.classList.add("edge");
	this.edgeElts[edge.id] = edgeElt;
	this.edgeGroup.appendChild(edgeElt);
	this.updateTextBox(this.graph.adjacencyLists());

	const weightElt = document.createElementNS(SVG_NS, "text");
	weightElt.setAttributeNS(null, "x", (vtx1.x + vtx2.x) / 2);
	weightElt.setAttributeNS(null, "y", (vtx1.y + vtx2.y) / 2);
	weightElt.setAttributeNS(null, "text-anchor", "middle");
	weightElt.setAttributeNS(null, "dominant-baseline", "middle");
	weightElt.classList.add("weight");
	weightElt.textContent = edge.weight;
	this.edgeGroup.appendChild(weightElt);

    }

    this.updateTextBox = function (str) {
	this.text.innerHTML = str;
    }

    /*********************************************************
     * Methods to (un)highlight and (un) mute vertices/edges *
     *********************************************************/

    this.highlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("highlight");
    }

    this.unhighlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("highlight");	
    }

    this.muteVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("muted");
    }

    this.unmuteVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("muted");
    }

    this.highlightEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.add("highlight");	
    }

    this.unhighlightEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.remove("highlight");	
    }

    this.unhighlightAllVertices = function () {
	for (vtx of this.graph.vertices) {
	    this.unhighlightVertex(vtx);
	}
    }

    this.unhighlightAllEdges = function () {
	for (e of this.graph.edges) {
	    this.unhighlightEdge(e);
	}
    }

    this.unhighlightAll = function () {
	this.unhighlightAllVertices();
	this.unhighlightAllEdges();
    }
    

    this.muteEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.add("muted");
    }

    this.unmuteEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.remove("muted");
    }

    this.muteAllVertices = function () {
	for (vtx of this.graph.vertices) {
	    this.muteVertex(vtx);
	}
    }

    this.muteAllEdges = function () {
	for (e of this.graph.edges) {
	    this.muteEdge(e);
	}
    }

    this.muteAll = function () {
	this.muteAllVertices();
	this.muteAllEdges();
    }

    this.unmuteAllVertices = function () {
	for (vtx of this.graph.vertices) {
	    this.unmuteVertex(vtx);
	}
    }

    this.unmuteAllEdges = function () {
	for (e of this.graph.edges) {
	    this.unmuteEdge(e);
	}
    }

    this.unmuteAll = function () {
	this.unmuteAllVertices();
	this.unmuteAllEdges();
    }
        
}

//a function that runs the prims algorithm and returns the minimum spanning tree
//input: graph
//output: minimum spanning tree
function prim(){
	console.log("prim running");
	let startVertex = null; 
	//ask for start vertex, 
	//if the graph has no vertex, then ask the user to add vertex first and return
	if (graph.vertices.length == 0){
		alert("Please add vertex first");
		return;
	}
	else{
		startVertex = prompt("Enter the start vertex");
	}

	//access the vertices array in the graph
	let allVertices = graph.vertices;
	//access the edges array in the graph
	let allEdges = graph.edges;

	//array to store visited vertices
	let visited = [];
	visited.push(startVertex);

	while ( visited.length != allVertices.length){
		// check for the cheapest edge and add that vertex to the visited array
		for ( let i = 0; i < visited.length; i++){

			for ( let j = 1; j < currentEdges.length; j++){
				let cheapestEdge = currentEdges[0];
				let currentEdge = currentEdges[j];
				//get the cheapest edge from all of the edges of the current vertex
				if ( currentEdge.weight < cheapestEdge.weight){
					cheapestEdge = currentEdge;
					console.log(cheapestEdge);
				}
				//add the cheapest edge to the visited array
				visited.push(cheapestEdge.vtx2);

				console.log(visited);


			}
		}

	}





}



const svg = document.querySelector("#graph-box");
const text = document.querySelector("#graph-text-box");
const graph = new Graph(0);
const gv = new GraphVisualizer(graph, svg, text);

