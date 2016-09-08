const app = require('../server'),
    request = require('supertest')

describe('Invalid app', function() {
    const agent = request.agent(app)
    let id
    it('connects to server', function(done){
        agent.post('/users/register/toto/')
		.end(function(err, res) {
                expect(res.status).toBe(200)
				id = res.body.id
				expect(id).not.toBeUndefined()
				done()
			})
    })
    
	it('asks who is a user', function(done) {
		agent.get('/users/whois/nobody/')
			.end(function(err, res) {
                expect(res.status).toBe(404)
				const message = res.body
				expect(message).not.toBeUndefined()
				if (message !== undefined) {
					expect(message.error).toBe('Unknown nick')
				}
				done()
			})
	})
    
    it('joins a channel', function(done) {
        agent.put('/user/INVALID-ID/channels/channel-1/join/')
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
				if (message !== undefined) {
					expect(message.error).toEqual('Unknown user ID')
				}
				done()
            })
    })
    
    it('talks in channel', function(done) {
        agent.put('/user/INVALID-ID/channels/channel-1/say/')
            .send({ message: 'Hello, world!' })
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
				if (message !== undefined) {
					expect(message.error).toEqual('Unknown user ID')
				}
				done()
            })
    })
    
    it('sends a private message with wrong ID', function(done) {
        agent.put('/user/INVALID-ID/message/toto/')
            .send({ message: 'Private message 1' })
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
				if (message !== undefined) {
					expect(message.error).toEqual('Unknown user ID')
				}
                done()
            })
    })
    
    it('sends a private message to a non existing user', function(done) {
        agent.put('/user/' + id + '/message/foobar/')
            .send({ message: 'Private message 2' })
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
				if (message !== undefined) {
					expect(message.error).toEqual('Unknown username')
				}
                done()
            })
    })
    
    it('changes the description with a wrong username', function(done) {
        agent.put('/user/INVALID-ID/channels/channel-1/description/')
            .send( { description: 'Some description' })
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
                if (message !== undefined) {
                    expect(message.error).toEqual('Unknown user ID')
                }
                done()
            })
    })
    
    it('changes the description of a non existing channel', function(done) {
        agent.put('/user/' + id + '/channels/INVALID-NAME/description/')
            .send( { description: 'Some description' })
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
                if (message !== undefined) {
                    expect(message.error).toEqual('Unknown channel')
                }
                done()
            })
    })
    
    it('checks for notices with wrong ID', function(done) {
        agent.get('/user/INVALID-ID/notices/')
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
				expect(message.error).not.toBeUndefined()
				if (message.error !== undefined) {
					expect(message.error).toEqual('Unknown user ID')
				}
				done()
            })
    })
    
    it('checks for notices with good ID', function(done) {
        agent.get('/user/' + id + '/notices/')
            .end(function(err, res) {
                expect(res.status).toBe(200)
                const notices = res.body
                expect(notices).not.toBeUndefined()
				expect(notices.length).toBe(0)
				done()
            })
    })
    
    it('disconnects', function(done) {
        agent.del('/user/INVALID-ID/disconnect/')
            .end(function(err, res) {
                expect(res.status).toBe(404)
                const message = res.body
                expect(message).not.toBeUndefined()
				if (message !== undefined) {
					expect(message.error).toBe('Unknown user ID')
				}
				done()
            })
    })

    it('disconnects', function(done) {
        agent.del('/user/' + id + '/disconnect/')
            .end(function(err, res) {
                expect(res.status).toBe(200)
                const status = res.body.status
                expect(status).toBe('Successfully disconnected from the server')
				done()
            })
    })
})
