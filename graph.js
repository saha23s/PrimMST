// UPDATE: Prim solid done 
//TO_DO: kruskal 
// TO_DO: more in whassap 
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
    this.addEdgeUser = function(vtx1, vtx2) {
	if (!this.isEdge(vtx1, vtx2)) {
		const weight = prompt("Enter weightage for edge (" + vtx1.id + ", " + vtx2.id + "):");
	    const edge = new Edge(vtx1, vtx2, this.nextEdgeID, parseInt(weight));
	    this.nextEdgeID++;
	    vtx1.addNeighbor(vtx2);
	    vtx2.addNeighbor(vtx1);
	    //vtx1.addEdge(edge);  // adding edge to the set of edges incident to vtx1
		//vtx2.addEdge(edge);  // adding edge to the set of edges incident to vtx2
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

	this.addEdge = function(vtx1, vtx2) {
		if (!this.isEdge(vtx1, vtx2)) {
			// randomly generate weight within 1 to 10
			const weight = Math.floor(Math.random() * 10) + 1;
			const edge = new Edge(vtx1, vtx2, this.nextEdgeID, weight);
			this.nextEdgeID++;
			vtx1.addNeighbor(vtx2);
			vtx2.addNeighbor(vtx1);
			this.edges.push(edge);
			console.log("added edge (" + vtx1.id + ", " + vtx2.id + ") with weightage " + weight);
			
			return edge;
		} else {
			console.log("edge (" + vtx1.id + ", " + vtx2.id + ") not added because it is already in the graph");
			return null;
		}
		}

	this.addEdgeIndividual = function(edge) {
		this.edges.push(edge);
		this.nextEdgeID++;
		console.log("added edge (" + edge.vtx1.id + ", " + edge.vtx2.id + ") with weightage " + edge.weight);
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

	// clear the graph 
	this.clear = function () {
		this.vertices = [];
		this.edges = [];
		this.nextVertexID = 0;
		this.nextEdgeID = 0;
		//remove the text in the weightage paragraph too 
		const weightageParagraph = document.getElementById("weightage-paragraph");
		weightageParagraph.innerHTML = "";

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
	this.vertextEdges = [];    // the edges incident to this vertex

	// add edge to the set of edges incident to this vertex, if the
	// edge is not already stored as an edge incident to this vertex
	this.addEdge = function (edge) {
		if (!this.vertexEdges.includes(edge)) {
			this.vertexEdges.push(edge);
		}
	}

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

	// return weight of an edge given two vertices
	this.getWeight = function (vtx1, vtx2) {
		if (this.equals(vtx1, vtx2)) {
			return this.weight;
		}
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
		this.addEdgeUser(edge);
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
	    let e = this.graph.addEdgeUser(other, vtx);
	    if (e != null) {
		this.addEdgeUser(e);
	    }
	    this.unhighlightVertex(other);
	    this.removeOverlayVertex(other);
	}
    }

    // add an edge to the visualization
    this.addEdgeUser = function (edge) {
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

	//clear the text box and anything drawn on the svg 
	this.clear = function () {
		this.text.innerHTML = "";
		this.vertexGroup.innerHTML = "";
		this.edgeGroup.innerHTML = "";
		this.vertexElts = {};
		this.edgeElts = {};
		this.highVertices = [];
		this.highEdges = [];
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

	this.highlightEdgePink = function (e) {
		const elt = this.edgeElts[e.id];
		elt.classList.add("highlight-pink");	
	}

	this.unhighlightEdgePink = function (e) {
		const elt = this.edgeElts[e.id];
		elt.classList.remove("highlight-pink");	
	}

	this.unhighlightAllPinkEdges = function () {
		for (e of this.graph.edges) {
			this.unhighlightEdgePink(e);
		}
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
        

/******************************************************
	 * Methods to change layout 
	 ***  ************************************************/

	// Set layout where vertices are evenly spaced around a circle
    // centered at (cx, cy) with radious r. The order of vertices
    // around the circle is random.
	this.setLayoutCircle = function (cx, cy, r) {
		let vertices = this.graph.vertices;
		let n = vertices.length;
	
		for (let i = 1; i < n; i++) {
			let j = Math.floor(Math.random() * (i + 1));
			let tmp = vertices[i];
			vertices[i] = vertices[j];
			vertices[j] = tmp;
		}
	
		for (let i = 0; i < n; i++) {
			this.graph.vertices[i].x = r * Math.cos(2 * Math.PI * i / n) + cx;
			this.graph.vertices[i].y = r * Math.sin(2 * Math.PI * i / n) + cy;
		}
	}

	this.drawCircle = function () {
		this.setLayoutCircle(300, 200, 180);
		this.draw();
	}
}


  function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }


//build a simple example of a graph
function buildSimpleExample () { 
    vertices = [];

	// randomly generate the vertices while keeping the x and y coordinates within the svg 
	for (let i = 0; i <= 6; i++) {
		//making sure that the vertices and edges are not overlapping
		const x = Math.floor(Math.random() * 550) + 1;
		const y = Math.floor(Math.random() * 380) + 1;
		let vtx = graph.createVertex(x, y);
		vertices.push(vtx);
		graph.addVertex(vtx);
	}

	//made changes in how the graph looks
	graph.addEdge(vertices[0], vertices[2]); 
	graph.addEdge(vertices[0], vertices[1]); 
	graph.addEdge(vertices[1], vertices[3]);
	graph.addEdge(vertices[1], vertices[4]);
	graph.addEdge(vertices[2], vertices[5]);
	graph.addEdge(vertices[3], vertices[2]);
	graph.addEdge(vertices[3], vertices[5]);
	graph.addEdge(vertices[4], vertices[6]);
	graph.addEdge(vertices[4], vertices[5]);
	graph.addEdge(vertices[5], vertices[6]);
    
    
}

//input: graph
//output: minimum spanning tree
async function prim(){
	console.log("prim running"); 
	
	//fetch user input from the html page
	let startVertex = document.getElementById("input-box").value;
	console.log(startVertex);
	
	if (graph.vertices.length == 0){
		alert("Add vertices first");
		return;
	}
	else if (startVertex == ""){
		alert("Enter a start vertex");
		return;

	}


	//array to store visited vertices
	let visited = [];
	var cost = 0;
	let costAdd = false;

	//checking the valiidity of the start vertex and pushing it in the visited array	
	if ( visited.length == 0 ){
		for ( let i = 0; i < graph.vertices.length; i++){
			if ( graph.vertices[i].id == startVertex){
				startVertex = graph.vertices[i];
				visited.push(graph.vertices[i].id);
				break; 
			}
			else if ( i == graph.vertices.length - 1){
				alert("Invalid start vertex");
				return;
			}
		}

	} 

	let pq = new PriorityQueue();
	let set = new Set();

	//should not run: if the edge set is empty or if all the vertices have been visited
	while ( graph.edges.length != 0 && visited.length != graph.vertices.length ){
		console.log("enqueuing edges");
		for (let i = 0 ; i< set.size; i++){
			gv.highlightEdgePink(graph.edges[i]);
			await sleep(1000);
		}
		//enqueue all the edges that are connected to the start vertex 
		for ( let i = 0; i < graph.edges.length; i++){
			if ( graph.edges[i].vtx1.id == startVertex.id || graph.edges[i].vtx2.id == startVertex.id){
				// if that edge already exists in the priority queue, then don't enqueue it
				if ( set.has(graph.edges[i]) ){
					continue;
				}
				pq.enqueue(graph.edges[i], graph.edges[i].weight);
				set.add(graph.edges[i]);
				console.log("enqueued edge: vtx1- vtx2 - weight  " + graph.edges[i].vtx1.id + " " + graph.edges[i].vtx2.id + " " + graph.edges[i].weight);
				gv.highlightEdgePink(graph.edges[i]);
			  	await sleep(1000);
			}
		}

		
		//iterate till all vertices are visited or there are no more edges in the priority queue
		while ( !pq.isEmpty() ){ //- this considition is never used since we always break out of the loop but anyways 
			// Dequeue the edge with the minimum weight from the priority queue
			let minEdge = pq.dequeue();
			console.log("min edge vtx1 - vtx2 - weight: " + minEdge.vtx1.id + " " + minEdge.vtx2.id + " " + minEdge.weight);
			
			gv.highlightEdge(minEdge);
			gv.unhighlightAllPinkEdges();
			await sleep(1000);
			// Add the vertices of the dequeued edge to the set of visited vertices
			if (!visited.includes(minEdge.vtx1.id)) {
			visited.push(minEdge.vtx1.id);
			console.log("just pushed ids " +  minEdge.vtx1.id);
			console.log("visited ids: " + visited);  
			startVertex  = minEdge.vtx1; 
			console.log( "startvertex: " + startVertex.id); 
			if (costAdd == false){
				cost += parseInt(minEdge.weight);
				costAdd = true;
			}
			
			}
			if (!visited.includes(minEdge.vtx2.id)) {
			visited.push(minEdge.vtx2.id);
			startVertex  = minEdge.vtx2;
			console.log("just pushed pt2 " +  minEdge.vtx1.id);
			console.log("visited pt2 : " + visited);  
			if (costAdd == false){
				cost += parseInt(minEdge.weight);
				costAdd = true;
			}
			}

			// Add the weight of the dequeued edge to the cost
			costAdd = false;
			console.log("cost: " + cost);
			break ; 
		}
	}

	console.log("final visited: " + visited);
	costbox.innerHTML = "Minimum Cost using Prim: " + cost;
	return visited; 
}

//check if the graph has a cycle 
//input: graph
//output : boolean
function hasCycle(edge, graph){
	graph.addEdgeIndividual(edge);
	graph.addVertex(edge.vtx1);
	graph.addVertex(edge.vtx2);
	let visited = {};
	// set every vertex to false
	for (let i = 0; i < graph.vertices.length; i++){
		visited[graph.vertices[i].id] = false;
	}
	// the set stores the edges that have been visited
	let set = new Set();
	let cycle = false; 
	let startVertex = graph.vertices[0]; 
	// creating a queue
	let q = [];
	q.push(startVertex);
	visited[startVertex.id] = true;
	//enqueue all the edges that are connected to the start vertex
	while(q.length != 0){
		// prints every vertex in the queue in a readabe format
		console.log("queue: ");
		for (let i = 0; i < q.length; i++){
			console.log(q[i].id);
		}
		let vtx = q.shift();
		for (let i = 0; i < graph.edges.length; i++){
			if (graph.edges[i].vtx1.id == vtx.id || graph.edges[i].vtx2.id == vtx.id){
				console.log(graph.edges[i]);
				if (set.has(graph.edges[i]) ){
					console.log("edge already in set");
					continue;
				}
				if (visited[graph.edges[i].vtx1.id] && visited[graph.edges[i].vtx2.id] ){
					cycle = true;
					console.log("cycle found");
					return true;
				}
				else if ( !visited[graph.edges[i].vtx1.id] ){
					q.push(graph.edges[i].vtx1);
					visited[graph.edges[i].vtx1.id] = true;
				}
				else if ( !visited[graph.edges[i].vtx2.id] ){
					q.push(graph.edges[i].vtx2);
					visited[graph.edges[i].vtx2.id] = true;
				}
				set.add(graph.edges[i]);
				console.log("adding the edge to the set");
			}
		}
	}
	console.log("cycle: " + cycle);
	return false;
	}



// problem with the cost being calculated and need to implement the cycle check thingy 
//use union find for the cycle check thingy
function kruskal(){
	console.log("kruskal running");
	let visited = [];
	var cost = 0;
	// define a new graph
	let mst = new Graph(1);
	
	//sort the edges in ascending order of their weights
	// graph.edges.sort(function(a, b){return a.weight - b.weight});
	// console.log(graph.edges);

	
	// Create a new priority queue
	let pq = new PriorityQueue();

	// Enqueue all edges in the graph
	for (let i = 0; i < graph.edges.length; i++) {
		console.log("enqueuing edges");
		pq.enqueue(graph.edges[i], graph.edges[i].weight);
	}

	console.log(pq.heap); 

	//iterate till all vertices are visited or there are no more edges in the priority queue 
	while (graph.edges.length != 0 && !pq.isEmpty() ){
		// Dequeue the edge with the minimum weight from the priority queue
		let minEdge = pq.dequeue();
		console.log("min edge vtx1 - vtx2 - weight: " + minEdge.vtx1.id + " " + minEdge.vtx2.id + " " + minEdge.weight);
		//check if the edge creates a cycle or not 
		//if it does, then don't add it to the visited array and don't add the weight to the cost
		if (hasCycle(minEdge, mst) == true){
			console.log("cycle detected");
			continue;
		}
		//if it doesn't, then add it to the visited array and add the weight to the cost
		else{
			console.log("no cycle detected");
			//check if the vertices of the edge are already in the visited array or not
			//if they are, then don't add them to the visited array
			if (visited.includes(minEdge.vtx1.id) && mst.vertices.includes(minEdge.vtx1.id) ){
				visited.push(minEdge.vtx2.id);
				mst.vertices.push(minEdge.vtx2.id);
			}
			//if they aren't, then add them to the visited array
			if (visited.includes(minEdge.vtx2.id) && mst.vertices.includes(minEdge.vtx2.id)){
				visited.push(minEdge.vtx1.id);
				mst.vertices.push(minEdge.vtx1.id);
			}
			else{
				visited.push(minEdge.vtx1.id);
				visited.push(minEdge.vtx2.id);
				mst.vertices.push(minEdge.vtx1.id);
				mst.vertices.push(minEdge.vtx2.id);

				
			}
			mst.edges.push(minEdge);
			cost += parseInt(minEdge.weight);
			console.log("cost: " + cost); 
			console.log("mst : " + mst.edges);

			

		}
		
	}
	
	console.log("final visited: " + visited);
	costbox.innerHTML = "Minimum Cost using Kruskal: " + cost;
	return visited; 
}

// clears whatever the user drew on the svg so far 
function reset(){

	console.log("resetting");
	gv.clear();
	graph.clear(); 


}

// priority queue class using a min heap
class PriorityQueue {
	constructor() {
	  this.heap = [];
	}
	
	enqueue(value, priority) {
	  const node = { value, priority };
	  this.heap.push(node);
	  this.bubbleUp(this.heap.length - 1);
	}
	
	dequeue() {
	  const root = this.heap[0];
	  const lastNode = this.heap.pop();
	  if (this.heap.length > 0) {
		this.heap[0] = lastNode;
		this.bubbleDown(0);
	  }
	  return root.value;
	}
	
	bubbleUp(index) {
	  const node = this.heap[index];
	  while (index > 0) {
		const parentIndex = Math.floor((index - 1) / 2);
		const parent = this.heap[parentIndex];
		if (node.priority >= parent.priority) {
		  break;
		}
		this.heap[index] = parent;
		index = parentIndex;
	  }
	  this.heap[index] = node;
	}
	
	bubbleDown(index) {
	  const node = this.heap[index];
	  const length = this.heap.length;
	  while (true) {
		const leftChildIndex = index * 2 + 1;
		const rightChildIndex = index * 2 + 2;
		let leftChild, rightChild;
		let swapIndex = null;
		if (leftChildIndex < length) {
		  leftChild = this.heap[leftChildIndex];
		  if (leftChild.priority < node.priority) {
			swapIndex = leftChildIndex;
		  }
		}
		if (rightChildIndex < length) {
		  rightChild = this.heap[rightChildIndex];
		  if ((swapIndex === null && rightChild.priority < node.priority) ||
			  (swapIndex !== null && rightChild.priority < leftChild.priority)) {
			swapIndex = rightChildIndex;
		  }
		}
		if (swapIndex === null) {
		  break;
		}
		this.heap[index] = this.heap[swapIndex];
		index = swapIndex;
	  }
	  this.heap[index] = node;
	}

	isEmpty() {
		return this.heap.length == 0;
	}
  }
  


const svg = document.querySelector("#graph-box");
const text = document.querySelector("#graph-text-box");
const graph = new Graph(0);
const gv = new GraphVisualizer(graph, svg, text);
const costbox = document.querySelector("#cost");


const btnSimpleGraph = document.querySelector("#btn-simple-graph");
btnSimpleGraph.addEventListener("click", function () {
	//if smth in the svg, then clear svg and graph
	gv.clear();
	graph.clear(); //-> works 
    buildSimpleExample(graph); // create a new example 
    gv.drawCircle(); 
});