const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "https://restart.fixhd.tv",
		methods: [ "GET", "POST" ]
	}
})

const PORT = process.env.PORT || 80;

io.on("connection", (socket) => {
	socket.emit("me", socket.id)
	
	console.log("NEW CONNECTION ", socket.id)

	socket.on("disconnect", () => {
		console.log("DISCONNECTED", socket.id)
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		console.log("CALL INIT", socket.id, "->", data.userToCall)
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		console.log("CALL STARTED", socket.id, "->", data.to)
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(PORT, () => console.log("Server is running on port",PORT))