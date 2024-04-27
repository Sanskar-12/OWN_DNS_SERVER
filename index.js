import dgram from "node:dgram";
import dnsPacket from "dns-packet";

const server = dgram.createSocket("udp4");

const db = {
  "piyushgarg.dev": "1.2.3.4",
  "blog.piyushgarg.dev": "4.5.6.7",
};

server.on("message", (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);

  const ipFromDb = db[incomingReq.questions[0].name];

  const ans = dnsPacket.encode({
    type: "response",
    id: incomingReq.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingReq.questions,
    answers: [
      {
        type: "A",
        class: "IN",
        name: incomingReq.questions[0].name,
        data: ipFromDb,
      },
    ],
  });

  console.log(ans);

  server.send(ans, rinfo.port, rinfo.address);
});

server.bind(53, () => {
  console.log("DNS server is running on port 53");
});
