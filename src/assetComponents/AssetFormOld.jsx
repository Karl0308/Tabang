import React, { useState, useEffect } from 'react'
import { Form, Button, ListGroup } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Link, useParams, useNavigate    } from 'react-router-dom'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { keepPreviousData, useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { APIURLS } from "../APIURLS";
import { toast } from 'react-toastify';
const axiosInstanceGet = axios.create({
  headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
  }
});
const getAssetById = async (assetid) => {  
  if(!assetid || isNaN(assetid)) { assetid = "0";}  
  axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
  const response = await axiosInstanceGet.get(
    APIURLS.asset.getAssetById + assetid.toString()
  );  
  response.data.id = assetid;
  return response.data;
};

const addAsset = (asset) => {
  asset.id = 0
  axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
    return axiosInstanceGet.post(APIURLS.asset.addAsset, asset);    
};

const editAsset = (asset) => {
  axiosInstanceGet.defaults.headers['Authorization'] = `Bearer ${localStorage.getItem("token")}`;
  return axiosInstanceGet.put(APIURLS.asset.editAsset, asset);    
}

function AssetForm() {
  const navigate = useNavigate();
  const [currentAsset, setCurrentAsset] = useState();
  
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const queryClient = useQueryClient()
    let { assetid } = useParams ();    
    if(!assetid) { assetid = 0;}    
    let {
      data,
      isError,
      error,    
      isPending,
      isSuccess,
      status,
    } =  useQuery({ queryKey: ['getAssetById', assetid], 
                    queryFn: () => getAssetById(assetid),                    
                    refetchOnWindowFocus: false,
                    staleTime: 0,             
                  });                    
                  const schema = yup
                  .object().shape({                    
                    code: yup.string().required().max(50),
                    name: yup.string().required().max(50),
                    branch: yup.string().required().max(50),
                    equipment: yup.string().optional().max(100),    
                  })
                  .required();  
  
      
 const handleChange = (event) => {
      const value = event.target.value;
      setInputValue(value);
    
      const searchTermParam = value !== null ? value : "";

      axiosInstanceGet.get(`${APIURLS.ticket.ticketBase}GetAssets?searchTerm=${searchTermParam}`)
        .then((response) => {
          const allSuggestions = [];
          response.data.forEach((asset) => {
            allSuggestions.push(asset.equipment);
          });
    
          const filteredSuggestions = allSuggestions.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filteredSuggestions);
        })
        .catch((error) => {
          console.error("Error fetching assets:", error);
        });
    };
    


  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const {
      register,
      handleSubmit,  
      reset,      
      setValue,
      formState: { errors },
      } = useForm({        
        defaultValues: async () => getAssetById(assetid),
        resolver: yupResolver(schema),
      });

      // useEffect(() => {
      //   async function fetchMyAPI() {
      //     let resp = await getAssetById(assetid);
      //     console.log(resp);
      //     reset({
      //       data: resp,
      //     });
      //     setValue('yourDetails', { firstName: 'value' });
      //   }
    
      //   fetchMyAPI()
      // }, [])

      // useEffect(() => {
      //   if(isSuccess){
          
      //   }
      // }, [status,data]);

    const addAssetMutation = useMutation({
      mutationFn: addAsset,
      onSuccess: (data, variables, context) => {
        toast("Asset Added!");        
        navigate(`/assets`, { replace: true });
      }
    });
    
    const editAssetMutation = useMutation({
      mutationFn: editAsset,
      onSuccess: (data, variables, context) => {
        toast("Asset Updated!");
        navigate(`/assets`, { replace: true });
      }
    });
                
    if(addAssetMutation.isPending) { return <div>Adding Asset....</div>;}
    if(addAssetMutation.isError) { return <div>An error occurred: {addAssetMutation.error.message}</div>;}
   
    if(editAssetMutation.isPending) { return <div>Editing Asset....</div>;}
    if(editAssetMutation.isError) { return <div>An error occurred: {editAssetMutation.error.message}</div>;}
    
      const onSubmit = (assetObj) => {        
        //console.log("from form",assetObj);
          if(!assetObj) { return; }
          assetObj.equipment = inputValue;
          if(assetObj.id <= 0) {
            addAssetMutation.mutate(assetObj);
          } else if(assetObj.id > 0) {
            assetObj.id = assetid;
            editAssetMutation.mutate(assetObj);
          }
      };
        

  return (
    <div>
        <h3>Asset</h3>        
        <hr className='my-1' />
        <Form onSubmit={handleSubmit(onSubmit)}>        
        <Form.Group className="mb-3 text-start" controlId="formAssetCode">
        <Form.Control type="number" style={{ "display": "none"}} {...register("id")}  />                
          <Form.Label className="text-start">Asset Tag</Form.Label>
          <Form.Control autoComplete='off' placeholder="Enter Asset Tag" {...register("code")}  />                
            {errors.code && (
              <Form.Text className="text-danger">
                {errors.code.message}
              </Form.Text>
            )}
        </Form.Group>     
        <Form.Group className="mb-3 text-start" controlId="formAssetName">
          <Form.Label className="text-start">Description</Form.Label>
          <Form.Control autoComplete='off' type="text" placeholder="Enter Description" {...register("name")}  />        
          {errors.name && (
              <Form.Text className="text-danger">
                {errors.name.message}
              </Form.Text>
            )}
        </Form.Group>     
        <Form.Group className="mb-3 text-start" controlId="formAssetBranch">
          <Form.Label className="text-start">Section</Form.Label>
          <Form.Control autoComplete='off' type="text" placeholder="Enter Section" {...register("branch")}  />        
          {errors.branch && (
              <Form.Text className="text-danger">
                {errors.branch.message}
              </Form.Text>
            )}
        </Form.Group>     
        <Form.Group className="mb-3 text-start" controlId="formAssetEquipment" hidden>
          <Form.Label className="text-start">Category</Form.Label>
          <Form.Control autoComplete='off' type="text" value={inputValue} placeholder="Enter Category" {...register("equipment")}  />        
          {errors.equipment && (
              <Form.Text className="text-danger">
                {errors.equipment.message}
              </Form.Text>
            )}
        </Form.Group>     

        <Form.Group className="mb-3 text-start">
          <Form.Label className="text-start">Category</Form.Label>
          <Form.Control
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter Category"
          />
          {suggestions.length > 0 && (
          <ListGroup>
            {suggestions.map((suggestion, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ cursor: 'pointer' }}
              >
                {suggestion}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        </Form.Group>


        <Form.Group className='text-end'>
        <Button variant="success" type="submit">
          Save Changes
        </Button>
        <Link to={"/assets"} className='btn btn-secondary ms-1'>Cancel</Link>
        </Form.Group>
      </Form>
    </div>
  )
}

export default AssetForm