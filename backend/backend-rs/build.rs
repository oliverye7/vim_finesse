fn main() {
    prost_build::Config::new()
        .out_dir("src/proto")
        .compile_protos(&["protos/user.proto"], &["protos"])
        .unwrap();
}