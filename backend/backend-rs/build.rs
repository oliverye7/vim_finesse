fn main() {
    prost_build::Config::new()
        .out_dir("src/proto")
        .type_attribute(".", "#[derive(serde::Serialize,serde::Deserialize)]")
        .compile_protos(&["protos/user.proto"], &["protos"])
        .unwrap();
}