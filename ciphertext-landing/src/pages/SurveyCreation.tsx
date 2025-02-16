
import React, { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, Minus, KeyRound, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SurveyCreation = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [publicKeyHalf, setPublicKeyHalf] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: [''] }]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(questions.filter((_, index) => index !== questionIndex));
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (questionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock key generation
    const mockKey = "wx_pub_" + Math.random().toString(36).substring(2, 15);
    setPublicKeyHalf(mockKey);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="container mx-auto max-w-4xl px-6 py-16 relative">
        <Button
          variant="ghost"
          className="text-teal-300 absolute top-8 left-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 mt-16"
        >
          {!isSubmitted ? (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">
                Welcome, WorkNight Admin!
              </h1>
              <form onSubmit={handleSubmit} className="space-y-8">
                {questions.map((q, questionIndex) => (
                  <div key={questionIndex} className="p-6 glass-card">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-teal-300">Question {questionIndex + 1}</h3>
                      {questionIndex > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Textarea
                      value={q.question}
                      onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                      placeholder="Enter your encrypted question"
                      className="mb-4 bg-black/20 border-white/10 text-white"
                    />
                    
                    <div className="space-y-4">
                      {q.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="bg-black/20 border-white/10 text-white"
                          />
                          {optionIndex > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => removeOption(questionIndex, optionIndex)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-teal-300 hover:text-teal-200"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Option
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-teal-500/30 text-teal-300 hover:bg-teal-500/10"
                  onClick={addQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Question
                </Button>
                
                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg"
                >
                  <KeyRound className="mr-2 h-5 w-5" />
                  Create WorkNight Survey Public Key-Half
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-6"
            >
              <KeyRound className="w-16 h-16 mx-auto text-teal-300" />
              <h2 className="text-2xl font-bold text-teal-300">Public Key-Half Generated!</h2>
              <div className="p-4 bg-black/30 rounded-lg">
                <code className="text-teal-300 break-all">{publicKeyHalf}</code>
              </div>
              <p className="text-gray-300">
                Please save this key-half securely. You'll need it to decrypt survey responses.
              </p>
              <Button
                className="mt-6"
                onClick={() => {
                  setIsSubmitted(false);
                  setQuestions([{ question: '', options: [''] }]);
                }}
              >
                Create Another Survey
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SurveyCreation;
