import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update } from './apiUser';
import { Redirect } from 'react-router-dom';

class EditUser extends Component{
	
	constructor(){
		super();
		this.state = {
			id: "",
			email: "",
			password: "",
			name: "",
			redirectToProfile: false,
			error: "",
			filesize: 0,
			loading: false
		};
	}


	handleChange = (name) => (event) => {
		const value = name === 'photo' ? event.target.files[0] : event.target.value
		this.userData.set(name, value)
		this.setState({[name] : value});
	};

	init = (userId) => {
		const token = isAuthenticated().token;
		read(userId, token).then( data => {
			if(data.error){
				this.setState({redirectToProfile: true})
			}
			else{
				this.setState({id: data._id, email: data.email, name: data.name, error: ''});
			}
		});		
	};

	componentDidMount() {
		this.userData = new FormData();
		const userId = this.props.match.params.userId;
		this.init(userId);
	}



	isValid = () => {
		const { name, email, password} = this.state;
		if(name.length === 0){
			this.setState({ error: "Name is equired"});
			return false;
		}
		if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
			this.setState({ error: "A Valid email is required"});
			return false;
		}
		if(password.length>=1 && password.length<=5){
			this.setState({ error: "password must be 6 character long"});
			return false;
		}
		return true;
	}

	clickSubmit = event =>{
		event.preventDefault();
		this.setState({loading:true});
		if(this.isValid()){
			const userId = this.props.match.params.userId;
			const token = isAuthenticated().token;				
			update(userId, token, this.userData).then(data => {
				if (data.error) this.setState({error : data.error});
				else 
					this.setState({
						redirectToProfile: true
					});
			});			
		}

	};


	signupForm = (name, email, password) => (
		<form>
			<div className="form-group">
				<label className="text-muted">Profile Photo</label>
				<input onChange = {this.handleChange("photo")} type="file" accept="image/*" className="form-control"/>
			</div>
			<div className="form-group">
				<label className="text-muted">Name</label>
				<input onChange = {this.handleChange("name")} type="text" className="form-control" value={name} />
			</div>
			<div className="form-group">
				<label className="text-muted">Email</label>
				<input onChange = {this.handleChange("email")} type="email" className="form-control" value={email} />
			</div>
			<div className="form-group">
				<label className="text-muted">Password</label>
				<input onChange = {this.handleChange("password")} type="password" className="form-control" value={password} />
			</div>	
			<button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>									
		</form>		
	);

	render(){
		const {id, name, email, password, redirectToProfile, error, loading} = this.state

		if(redirectToProfile){
			return <Redirect to={`/user/${id}`} />
		}

		return(
			<div className="container">
				<h2 className="mt-5 mb-5">Edit Profile</h2>
				<div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>
				{loading 
					? (
						<div className="jumbotron text-center">Loading...</div>
					)
					: (
						""
					)}				
				{this.signupForm(name, email, password)}
			</div>
		);
	}
}

export default EditUser;