cmake_minimum_required(VERSION 3.12)
project(multiparty-fhe)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add OpenMP support for macOS
if(APPLE)
    if(CMAKE_C_COMPILER_ID MATCHES "Clang")
        set(OpenMP_C "${CMAKE_C_COMPILER}")
        set(OpenMP_C_FLAGS "-Xpreprocessor -fopenmp -I/usr/local/Cellar/libomp/19.1.7/include")
        set(OpenMP_C_LIB_NAMES "omp")
        set(OpenMP_omp_LIBRARY "/usr/local/Cellar/libomp/19.1.7/lib/libomp.dylib")
    endif()
    if(CMAKE_CXX_COMPILER_ID MATCHES "Clang")
        set(OpenMP_CXX "${CMAKE_CXX_COMPILER}")
        set(OpenMP_CXX_FLAGS "-Xpreprocessor -fopenmp -I/usr/local/Cellar/libomp/19.1.7/include")
        set(OpenMP_CXX_LIB_NAMES "omp")
        set(OpenMP_omp_LIBRARY "/usr/local/Cellar/libomp/19.1.7/lib/libomp.dylib")
    endif()
    
    # Add these explicit link and compile flags
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${OpenMP_C_FLAGS}")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenMP_CXX_FLAGS}")
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -L/usr/local/Cellar/libomp/19.1.7/lib")
endif()

# Find OpenMP
find_package(OpenMP REQUIRED)

# Add OpenFHE directory to CMAKE_PREFIX_PATH
list(APPEND CMAKE_PREFIX_PATH "/usr/local/lib/cmake/OpenFHE")

# Find OpenFHE
find_package(OpenFHE CONFIG REQUIRED)
if (OpenFHE_FOUND)
    message(STATUS "Found OpenFHE")
    message(STATUS "OpenFHE Version: ${BASE_OPENFHE_VERSION}")
    message(STATUS "OpenFHE include files: ${OpenFHE_INCLUDE}")
    message(STATUS "OpenFHE lib location: ${OpenFHE_LIBDIR}")
else()
    message(FATAL_ERROR "OpenFHE NOT FOUND")
endif()

# Find dependencies for Crow
find_package(Boost REQUIRED COMPONENTS system)
find_package(OpenSSL REQUIRED)

# Find CURL package
find_package(CURL REQUIRED)

# Add include directories
include_directories(${PROJECT_SOURCE_DIR}/include)
include_directories(${PROJECT_SOURCE_DIR}/Crow/include)
include_directories(${OPENSSL_INCLUDE_DIR})
include_directories(${Boost_INCLUDE_DIRS})
include_directories(${OpenFHE_INCLUDE})
include_directories(${OpenFHE_INCLUDE}/third-party/include)
include_directories(${OpenFHE_INCLUDE}/core)
include_directories(${OpenFHE_INCLUDE}/pke)
include_directories(${OpenFHE_INCLUDE}/binfhe)

# Server executable
add_executable(fhe_server src/server.cpp)
target_link_libraries(fhe_server
    PRIVATE
    ${OpenFHE_SHARED_LIBRARIES}
    Boost::system
    OpenSSL::SSL
    OpenSSL::Crypto
    OpenMP::OpenMP_CXX
    pthread
)

# Client executable
add_executable(fhe_client src/client.cpp)
target_link_libraries(fhe_client
    PRIVATE
    ${OpenFHE_SHARED_LIBRARIES}
    Boost::system
    OpenSSL::SSL
    OpenSSL::Crypto
    OpenMP::OpenMP_CXX
    pthread
    CURL::libcurl
)